import {animate, state, style, transition, trigger} from '@angular/animations';
import {formatDate} from '@angular/common';
import {Component, DoCheck, Inject, LOCALE_ID} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import {AdvancedCalculatorData} from '../../services/AdvancedCalculatorData';
import {CalculatorData} from '../../services/CalculatorData';
import {BalanceRow, CalculatorService, TITANO_DATA} from '../../services/CalculatorService';
import {CoinMarketCapCurrencies} from '../../services/CoinMarketCapCurrencies';
import {CoinMarketCapService} from '../../services/CoinMarketCapService';
import {WithdrawalPeriod} from '../../services/WithdrawalPeriod';
import {AboutTaxesDialogComponent} from '../about-taxes-dialog/about-taxes-dialog.component';
import {AdvancedSettingsComponent} from '../advanced-settings/advanced-settings.component';
import {BuyMeABeerComponent} from '../buy-me-a-beer/buy-me-a-beer.component';
import {DownloadBreakdownComponent} from '../download-breakdown/download-breakdown.component';
import '../../utils/utils'


@Component({
  selector: 'app-main-card',
  templateUrl: './main-card.component.html',
  styleUrls: ['./main-card.component.scss'],
  providers: [CalculatorService, CoinMarketCapService, {provide: Window, useValue: window}],
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
  titanoSettingsInUse = true;
  doNotShowAgain = false;
  november2021 = new Date(2021, 10, 1)
  private titanoAdvancedData = JSON.stringify(TITANO_DATA.advanced);

  today(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

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

  displayedColumns: string[] = ['from', 'initialAmount', 'to', 'finalAmount', 'value'];
  mobileColumns: string[] = ['to', 'finalAmount', 'value'];
  dataSource: BalanceRow[] = [];

  constructor(
    @Inject(LOCALE_ID) private locale: string,
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

  amountBeforeFeesAndTaxes() {
    return this.calculatorService.amountBeforeFeesAndTaxes(this.model);
  }

  firstWithdrawalDate() {
    return this.calculatorService.firstWithdrawalDate(this.model);
  }

  oneYearBalance() {
    return this.calculatorService.oneYearBalance(this.model);
  }

  estimatedOneYearProfit() {
    return this.calculatorService.estimatedOneYearProfit(this.model);
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
      wb.Props.Author = 'polentino911';
      wb.Props.CreatedDate = new Date();

      worksheet["!cols"] = [
        {wch: this.count(rows, p => p.f)},
        {wch: this.count(rows, p => p.ia)},
        {wch: this.count(rows, p => p.t)},
        {wch: this.count(rows, p => p.fa)},
        {wch: this.count(rows, p => p.v)}
      ];

      XLSX.utils.book_append_sheet(wb, worksheet, `1-Year Estimation`);
      XLSX.utils.sheet_add_aoa(worksheet, [[
          'From',
          `Initial Amount (${this.model.advanced.name})`,
          'To',
          `Final Amount (${this.model.advanced.name})`,
          `Value (${this.currency.symbol})`]],
        {origin: 'A1'});
      XLSX.writeFile(wb, `analysis_of_${this.model.initialCryptoCapital}_${this.model.advanced.name}_on_${formatDate(this.model.startDate, 'dd_MMM_YYYY', this.locale)}.xlsx`);
    });
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
