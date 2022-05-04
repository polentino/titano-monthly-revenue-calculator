import {animate, state, style, transition, trigger} from '@angular/animations';
import {formatDate} from '@angular/common';
import {Component, DoCheck, Inject, LOCALE_ID} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import {AdvancedCalculatorData} from '../../services/AdvancedCalculatorData';
import {CalculatorService} from "../../services/calculator.service";
import {CalculatorData} from '../../services/CalculatorData';
import {CoinMarketCapCurrencies, Currency} from '../../services/CoinMarketCapCurrencies';
import {CoinMarketCapService} from '../../services/CoinMarketCapService';
import {BalanceRow, EstimatorService, TITANO_DATA} from '../../services/estimator.service';
import {ProfitType} from "../../services/ProfitType";
import {WithdrawalPeriod} from '../../services/WithdrawalPeriod';
import {AboutTaxesDialogComponent} from '../about-taxes-dialog/about-taxes-dialog.component';
import {AdvancedSettingsComponent} from '../advanced-settings/advanced-settings.component';
import {BuyMeABeerComponent} from '../buy-me-a-beer/buy-me-a-beer.component';
import {DownloadBreakdownComponent} from '../download-breakdown/download-breakdown.component';
import '../../utils/utils'
import {
  PropertyEditorComponent,
  PropertyEditorData,
  PropertyEditorType
} from "../property-editor-component/property-editor.component";


@Component({
  selector: 'app-main-card',
  templateUrl: './main-card.component.html',
  styleUrls: ['./main-card.component.scss'],
  providers: [EstimatorService, CalculatorService, CoinMarketCapService, {provide: Window, useValue: window}],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MainCardComponent implements DoCheck {
  private previousModel = CalculatorData.clone(TITANO_DATA);
  model = CalculatorData.clone(TITANO_DATA);
  withdrawalPeriods = WithdrawalPeriod.values;
  WithdrawalPeriod = WithdrawalPeriod; // damn TS DI
  profitTypes = ProfitType.values;
  ProfitType = ProfitType; // damn TS DI - Part 2
  titanoSettingsInUse = true;
  doNotShowAgain = false;
  november2021 = new Date(2021, 10, 1)
  private titanoAdvancedData = JSON.stringify(TITANO_DATA.advanced);

  set taxesCalculationEnabled(value: boolean) {
    this.model.countryTaxesCalculationEnabled = value;
    if (value && !this.doNotShowAgain) {
      const ref = this.dialog.open(AboutTaxesDialogComponent, {
        disableClose: true,
        data: {
          symbol: this.currency.symbol,
          withdrawalPeriod: this.model.withdrawalPeriod
        }
      });

      ref.afterClosed().subscribe(doNotShowAgain => {
        this.doNotShowAgain = doNotShowAgain;
      });
    }
  }

  dateFormat = 'dd MMMM YYYY';
  shortDateFormat = 'dd MMM YY';
  expandedElement: BalanceRow | undefined;
  currencies = CoinMarketCapCurrencies.CURRENCIES;
  currency = this.currencies[9];
  fixedDesktopColumns = ['from', 'initialAmount', 'to', 'finalAmount'];
  fixedMobileColumns = ['to', 'finalAmount'];
  dataSource: BalanceRow[] = [];

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private estimatorService: EstimatorService,
    private calculatorService: CalculatorService,
    private cmcService: CoinMarketCapService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar, private window: Window
  ) {
    this.fetchQuote();
    this.dataSource = this.oneYearBalance();
  }

  ngDoCheck(): void {
    if (JSON.stringify(this.model) != JSON.stringify(this.previousModel)) { // ...
      this.previousModel = CalculatorData.clone(this.model);
      this.dataSource = this.oneYearBalance();
    }
  }

  fetchQuote() {
    if (!this.titanoSettingsInUse) {
      console.error('CoinMarketCap quote retrieval is disabled for custom tokens');
      return;
    }
    const c = this.currency;
    this.cmcService.getQuote(c)
      .subscribe(data => {
          const point = Object.values(data.data.points).pop();
          // of course, USD is handled in its own, special way :/
          this.model.cryptoPrice = c.id === 2781 ? point.v[0] : point.c[0];
        },
        error => {
          console.error(error);
          this.snackBar.open('Couldn\'t fetch TITANO quote; please insert it manually', 'Ok', {duration: 5000});
        });
  }

  periodicTitanoWithdrawal() {
    return this.amountBeforeFeesAndTaxes();
  }

  editProfitType() {
    const ref = this.dialog.open(PropertyEditorComponent, {
      disableClose: true,
      data: {
        editorType: PropertyEditorType.OTHER,
        title: 'Choose profit-taking type',
        label: 'Would like to withdraw a',
        currentValue: this.model.profitType,
        values: ProfitType.values,
        renderer: (o: ProfitType) => ProfitType.toDescription(o, this.model.withdrawalPeriod)
      }
    });

    ref.afterClosed().subscribe((data: PropertyEditorData<ProfitType>) => {
      if (data == undefined) return;
      this.model.profitType = data.currentValue
    });
  }

  editPeriodicAmountToWithdraw() {
    const ref = this.dialog.open(PropertyEditorComponent, {
      disableClose: true,
      data: {
        editorType: PropertyEditorType.NUMBER,
        title: `Withdraw amount (${this.currency.symbol})`,
        label: `${WithdrawalPeriod.toStringAdjective(this.model.withdrawalPeriod, true)} withdraw (${this.currency.symbol}):`,
        currentValue: this.model.desiredPeriodicAmountToWithdraw,
        values: [],
        renderer: (o: number) => o,
        validator: (o: number) => o !== undefined && o > 0
      }
    });

    ref.afterClosed().subscribe((data: PropertyEditorData<number>) => {
      if (data == undefined) return;
      this.model.desiredPeriodicAmountToWithdraw = data.currentValue;
    });
  }

  editRebasesPercentageToWithdraw() {
    const ref = this.dialog.open(PropertyEditorComponent, {
      disableClose: true,
      data: {
        editorType: PropertyEditorType.NUMBER,
        title: 'Rebase % to withdraw',
        label: 'values between 1 and 100 only',
        placeholder: 'i.e. 50 (%)',
        currentValue: this.model.desiredPeriodicRebasePercentageToWithdraw,
        values: [],
        renderer: (o: number) => o,
        validator: (o: number) => o !== undefined && (o > 0 && o <= 100)
      }
    });

    ref.afterClosed().subscribe((data: PropertyEditorData<number>) => {
      if (data == undefined) return;
      this.model.desiredPeriodicRebasePercentageToWithdraw = data.currentValue;
    });
  }

  editCurrency() {
    const ref = this.dialog.open(PropertyEditorComponent, {
      disableClose: true,
      data: {
        title: 'Select desired currency',
        editorType: PropertyEditorType.OTHER,
        currentValue: this.currency,
        values: this.currencies,
        renderer: (o: Currency) => o.symbol
      }
    });

    ref.afterClosed().subscribe((data: PropertyEditorData<Currency>) => {
      if (data == undefined) return;
      if (this.currency != data.currentValue) {
        this.currency = data.currentValue;
        this.fetchQuote();
      }
    });
  }

  editWithdrawalPeriod() {
    const ref = this.dialog.open(PropertyEditorComponent, {
      disableClose: true,
      data: {
        editorType: PropertyEditorType.OTHER,
        title: 'Select Withdrawal Period',
        label: 'Would like to withdraw every:',
        currentValue: this.model.withdrawalPeriod,
        values: WithdrawalPeriod.values,
        renderer: (o: WithdrawalPeriod) => WithdrawalPeriod.toStringNoun(o, true)
      }
    });

    ref.afterClosed().subscribe((data: PropertyEditorData<WithdrawalPeriod>) => {
      if (data == undefined) return;
      this.model.withdrawalPeriod = data.currentValue;
    });
  }

  editInitialWallet() {
    const ref = this.dialog.open(PropertyEditorComponent, {
      disableClose: true,
      data: {
        editorType: PropertyEditorType.NUMBER,
        title: `Initial capital (${this.model.advanced.name.toUpperCase()})`,
        label: `${this.model.advanced.name.toUpperCase()} in my wallet`,
        currentValue: this.model.initialCryptoCapital,
        values: [],
        renderer: (o: number) => o,
        validator: (o: number) => o !== undefined && o > 0
      }
    });

    ref.afterClosed().subscribe((data: PropertyEditorData<WithdrawalPeriod>) => {
      if (data == undefined) return;
      this.model.initialCryptoCapital = data.currentValue;
    });
  }

  editCryptoPrice() {
    const ref = this.dialog.open(PropertyEditorComponent, {
      disableClose: true,
      data: {
        editorType: PropertyEditorType.NUMBER,
        title: `${this.currency.symbol}/${this.model.advanced.name.toUpperCase()} price`,
        label: `Exchange rate`,
        currentValue: this.model.cryptoPrice,
        values: [],
        renderer: (o: number) => o,
        validator: (o: number) => o !== undefined && o > 0
      }
    });

    ref.afterClosed().subscribe((data: PropertyEditorData<number>) => {
      if (data == undefined) return;
      this.model.cryptoPrice = data.currentValue;
    });
  }

  editSlippageFees() {
    const ref = this.dialog.open(PropertyEditorComponent, {
      disableClose: true,
      data: {
        editorType: PropertyEditorType.NUMBER,
        title: 'Edit slippage fees (%)',
        label: 'slippage fees',
        placholder: '2 (%)',
        currentValue: this.model.slippageFeesPct,
        values: [],
        renderer: (o: number) => o,
        validator: (o: number) => o !== undefined && (o > 0 && o <= 100)
      }
    });

    ref.afterClosed().subscribe((data: PropertyEditorData<number>) => {
      if (data == undefined) return;
      this.model.slippageFeesPct = data.currentValue;
    });
  }

  editCountryTaxes() {
    if (!this.model.countryTaxesCalculationEnabled) return;

    const ref = this.dialog.open(PropertyEditorComponent, {
      disableClose: true,
      data: {
        editorType: PropertyEditorType.NUMBER,
        title: "Edit your Country's taxes (%)",
        label: 'country taxes percentage',
        placholder: '25 (%)',
        currentValue: this.model.countryTaxes,
        values: [],
        renderer: (o: number) => o,
        validator: (o: number) => o !== undefined && (o > 0 && o <= 100)
      }
    });

    ref.afterClosed().subscribe((data: PropertyEditorData<number>) => {
      if (data == undefined) return;
      this.model.countryTaxes = data.currentValue;
    });
  }

  amountBeforeFeesAndTaxes() {
    return this.estimatorService.amountBeforeFeesAndTaxes(this.model);
  }

  firstWithdrawalDate() {
    return this.estimatorService.firstWithdrawalDate(this.model);
  }

  oneYearBalance() {
    if (this.model.profitType == ProfitType.FIXED_AMOUNT) {
      return this.estimatorService.oneYearBalance(this.model);
    } else {
      return this.calculatorService.oneYearBalance(this.model);
    }
  }

  estimatedOneYearProfit() {
    return this.estimatorService.estimatedOneYearProfit(this.model);
  }

  openHowItWorksDialog() {
    this.window.open('https://github.com/polentino/titano-monthly-revenue-calculator/blob/master/THE_MATH_BEHIND.md', '_blank');
  }

  openBuyMeABeerDialog() {
    this.dialog.open(BuyMeABeerComponent);
  }

  openAdvancedSettings() {
    const dialogModel = {...this.model.advanced};
    const ref = this.dialog.open(AdvancedSettingsComponent, {
      disableClose: true,
      data: dialogModel
    });

    ref.afterClosed().subscribe((newSettings: AdvancedCalculatorData) => {
      if (newSettings === undefined || (JSON.stringify(newSettings) == this.titanoAdvancedData)) {
        this.titanoSettingsInUse = true;
        this.model.advanced = {...TITANO_DATA.advanced};
      } else {
        this.titanoSettingsInUse = false;
        this.model.advanced = newSettings;
      }
      // schedule a new estimation
      this.dataSource = this.oneYearBalance();
    });
  }

  download() {
    const ref = this.dialog.open(DownloadBreakdownComponent, {
      disableClose: true,
      data: this.dataSource
    });

    ref.afterClosed().subscribe((format: string) => {
      if (format === undefined) return;
      const wb = XLSX.utils.book_new();
      const rows = this.dataSource.map(s => ({
        f: formatDate(s.from, format, this.locale),
        ia: `${s.initialAmount}`,
        t: formatDate(s.to, format, this.locale),
        fa: `${s.finalAmount}`,
        v: `${s.value}`
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);

      if (!wb.Props) wb.Props = {};
      wb.Props.Author = 'https://twitter.com/polentino911';
      wb.Props.CreatedDate = new Date();

      worksheet["!cols"] = [
        {wch: this.count(rows, p => p.f)},
        {wch: this.count(rows, p => p.ia)},
        {wch: this.count(rows, p => p.t)},
        {wch: this.count(rows, p => p.fa)},
        {wch: this.count(rows, p => p.v)}
      ];

      const lastColumnName = this.model.profitType == ProfitType.FIXED_AMOUNT ? 'Wallet Value' : 'Rebases Profit';

      XLSX.utils.book_append_sheet(wb, worksheet, `1-Year Estimation`);
      XLSX.utils.sheet_add_aoa(worksheet, [[
          'From',
          `Initial Amount (${this.model.advanced.name})`,
          'To',
          `Final Amount (${this.model.advanced.name})`,
          `${lastColumnName} (${this.currency.symbol})`]],
        {origin: 'A1'});
      XLSX.writeFile(wb, `analysis_of_${this.model.initialCryptoCapital}_${this.model.advanced.name}_on_${formatDate(this.model.startDate, 'dd_MMM_YYYY', this.locale)}.xlsx`);
    });
  }

  optionalDays() {
    switch (this.model.withdrawalPeriod) {
      case WithdrawalPeriod.MONTHLY:
        return ' (31 days)';
      default:
        return '';
    }
  }

  rebasesProfits() {
    return this.dataSource.reduce((acc: number, currentValue: BalanceRow) => acc + currentValue.value, 0)
  }

  desktopColumns(): string[] {
    const cols = Object.assign([], this.fixedDesktopColumns);
    cols.push(this.model.profitType == ProfitType.FIXED_AMOUNT ? 'value' : 'profit');
    return cols;
  }

  mobileColumns(): string[] {
    const cols = Object.assign([], this.fixedMobileColumns);
    cols.push(this.model.profitType == ProfitType.FIXED_AMOUNT ? 'value' : 'profit');
    return cols;
  }

  private count(struct: Row[], selector: (p: Row) => string) {
    return struct.reduce((w, r) => Math.max(w, selector(r).length), 10) + 2;
  }
}

interface Row {
  f: string;
  ia: string;
  t: string;
  fa: string;
  v: string
}
