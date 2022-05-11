import {animate, state, style, transition, trigger} from '@angular/animations';
import {formatDate} from '@angular/common';
import {Component, DoCheck, Inject, LOCALE_ID} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CookieService} from 'ngx-cookie-service';
import * as XLSX from 'xlsx';
import {AdvancedCalculatorData} from '../../services/AdvancedCalculatorData';
import {CalculatorService} from '../../services/calculator.service';
import {CalculatorData} from '../../services/CalculatorData';
import {CoinMarketCapCurrencies, Currency} from '../../services/CoinMarketCapCurrencies';
import {CoinMarketCapService} from '../../services/CoinMarketCapService';
import {BalanceRow, EstimatorService, TITANO_DATA} from '../../services/estimator.service';
import {ProfitType} from '../../services/ProfitType';
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
} from '../property-editor-component/property-editor.component';


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
  private SETTINGS_COOKIE = 'settings-cookie';
  private CURRENCY_COOKIE = 'currency-cookie';
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
    this.model.countryTaxesCalculationEnabled = value;
    this.saveSettings();
  }

  get taxesCalculationEnabled(): boolean {
    return this.model.countryTaxesCalculationEnabled;
  }

  dateFormat = 'dd MMMM YYYY';
  shortDateFormat = 'dd MMM YY';
  expandedElement: BalanceRow | undefined;
  currencies = CoinMarketCapCurrencies.CURRENCIES;
  currency = {...this.currencies[9]};
  fixedDesktopColumns = ['from', 'initialAmount', 'to', 'finalAmount'];
  fixedMobileColumns = ['to', 'finalAmount'];
  dataSource: BalanceRow[] = [];

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private estimatorService: EstimatorService,
    private calculatorService: CalculatorService,
    private cmcService: CoinMarketCapService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private window: Window
  ) {
    this.reloadSettings();
    this.fetchQuote();
    this.dataSource = this.oneYearBalance();
  }

  ngDoCheck(): void {
    if (CalculatorData.toJSON(this.model) != CalculatorData.toJSON(this.previousModel)) { // ...
      this.saveSettings();
      this.previousModel = CalculatorData.clone(this.model);
      this.dataSource = this.oneYearBalance();
    }
  }

  private reloadSettings(): void {
    if (this.cookieService.check(this.SETTINGS_COOKIE)) {
      this.model = CalculatorData.fromJSON(this.cookieService.get(this.SETTINGS_COOKIE));
    }
    if (this.cookieService.check(this.CURRENCY_COOKIE)) {
      this.currency = JSON.parse(this.cookieService.get(this.CURRENCY_COOKIE)) as Currency;
    }
    this.titanoSettingsInUse = JSON.stringify(this.model.advanced) == this.titanoAdvancedData;
  }

  private saveSettings(): void {
    this.cookieService.set(this.SETTINGS_COOKIE, CalculatorData.toJSON(this.model));
    this.cookieService.set(this.CURRENCY_COOKIE, JSON.stringify(this.currency));
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
    this.editProperty({
      editorType: PropertyEditorType.OTHER,
      title: 'Choose profit-taking type',
      label: 'Would like to withdraw a',
      placeholder: '',
      currentValue: this.model.profitType,
      values: ProfitType.values,
      renderer: (o: ProfitType) => ProfitType.toDescription(o, this.model.withdrawalPeriod)
    }, value => this.model.profitType = value);
  }

  editPeriodicAmountToWithdraw() {
    this.editProperty({
      editorType: PropertyEditorType.NUMBER,
      title: `Withdraw amount (${this.currency.symbol})`,
      label: `${WithdrawalPeriod.toStringAdjective(this.model.withdrawalPeriod, true)} withdraw (${this.currency.symbol}):`,
      placeholder: 'amount',
      currentValue: this.model.desiredPeriodicAmountToWithdraw,
      values: [],
      renderer: (o: number) => `${o}`,
      validator: (o: number) => o !== undefined && o > 0
    }, value => this.model.desiredPeriodicAmountToWithdraw = value);
  }

  editRebasesPercentageToWithdraw() {
    this.editProperty({
      editorType: PropertyEditorType.NUMBER,
      title: 'Rebase % to withdraw',
      label: 'values between 1 and 100 only',
      placeholder: 'i.e. 50(%)',
      currentValue: this.model.desiredPeriodicRebasePercentageToWithdraw,
      values: [],
      renderer: (o: number) => `${o}`,
      validator: (o: number) => o !== undefined && (o > 0 && o <= 100)
    }, value => this.model.desiredPeriodicRebasePercentageToWithdraw = value);
  }

  editCurrency() {
    this.editProperty({
      title: 'Select desired currency',
      label: 'Country Currency:',
      editorType: PropertyEditorType.OTHER,
      currentValue: this.currency.id,
      placeholder: 'country currency, i.e. EUR',
      values: CoinMarketCapCurrencies.CURRENCIES_IDS,
      renderer: (o: number) => CoinMarketCapCurrencies.CURRENCIES.find(c => c.id == o)?.symbol || '???'
    }, value => {
      const currency = CoinMarketCapCurrencies.CURRENCIES.find(c => c.id == value)
      if (currency != undefined && this.currency != currency) {
        this.currency = currency;
        this.fetchQuote();
      }
    });
  }

  editWithdrawalPeriod() {
    this.editProperty({
      editorType: PropertyEditorType.OTHER,
      title: 'Select Withdrawal Period',
      label: 'Would like to withdraw every:',
      currentValue: this.model.withdrawalPeriod,
      placeholder: 'withdrawal period',
      values: WithdrawalPeriod.values,
      renderer: (o: WithdrawalPeriod) => WithdrawalPeriod.toStringNoun(o, true)
    }, value => this.model.withdrawalPeriod = value);
  }

  editInitialWallet() {
    this.editProperty({
      editorType: PropertyEditorType.NUMBER,
      title: `Initial capital (${this.model.advanced.name.toUpperCase()})`,
      label: `${this.model.advanced.name.toUpperCase()} in my wallet`,
      currentValue: this.model.initialCryptoCapital,
      placeholder: 'i.e. 100000',
      values: [],
      renderer: (o: number) => `${o}`,
      validator: (o: number) => o !== undefined && o > 0
    }, value => this.model.initialCryptoCapital = value);
  }

  editCryptoPrice() {
    this.editProperty({
      editorType: PropertyEditorType.NUMBER,
      title: `${this.currency.symbol}/${this.model.advanced.name.toUpperCase()} price`,
      label: `Exchange rate`,
      currentValue: this.model.cryptoPrice,
      placeholder: `${this.currency.symbol}/${this.model.advanced.name.toUpperCase()} rate`,
      values: [],
      renderer: (o: number) => `${o}`,
      validator: (o: number) => o !== undefined && o > 0
    }, value => this.model.cryptoPrice = value);
  }

  editSlippageFee() {
    this.editProperty({
      editorType: PropertyEditorType.NUMBER,
      title: 'Edit slippage fee (%)',
      label: 'slippage fee',
      placeholder: 'i.e. 2(%)',
      currentValue: this.model.slippageFeePct,
      values: [],
      renderer: (o: number) => `${o}`,
      validator: (o: number) => o !== undefined && (o > 0 && o <= 100)
    }, value => this.model.slippageFeePct = value);
  }

  editCountryTaxes() {
    if (!this.model.countryTaxesCalculationEnabled) return;

    this.editProperty({
      editorType: PropertyEditorType.NUMBER,
      title: "Edit your Country's taxes (%)",
      label: 'country taxes percentage',
      placeholder: 'i.e. 25(%)',
      currentValue: this.model.countryTaxes,
      values: [],
      renderer: (o: number) => `${o}`,
      validator: (o: number) => o !== undefined && (o > 0 && o <= 100)
    }, value => this.model.countryTaxes = value);
  }

  private editProperty<T>(data: PropertyEditorData<T>, onSuccess: (value: T) => void) {
    const ref = this.dialog.open(PropertyEditorComponent, {disableClose: true, data: data});

    ref.afterClosed().subscribe((data: PropertyEditorData<T>) => {
      if (data == undefined) return;
      onSuccess(data.currentValue);
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
      this.saveSettings();
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

      worksheet['!cols'] = [
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
