import {animate, state, style, transition, trigger} from "@angular/animations";
import {Component, EventEmitter} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CoinMarketCapCurrencies} from "../../services/CoinMarketCapCurrencies";
import {CoinMarketCapService} from "../../services/CoinMarketCapService";
import {BuyMeABeerComponent} from "../buy-me-a-beer/buy-me-a-beer.component";
import "../../utils/utils"

@Component({
  selector: 'app-main-card',
  templateUrl: './main-card.component.html',
  styleUrls: ['./main-card.component.scss'],
  providers: [CoinMarketCapService, { provide: Window, useValue: window }],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MainCardComponent {

  private _monthlyWithdraw = true;
  private _desiredPeriodicWithdraw = 1000;
  private _initialTitanoCapital = 2000;
  private _titanoPrice = 0.157907;
  private _feesPercentage = 18;
  private _taxesPercentage = 30;
  private emitter = new EventEmitter();

  get monthlyWithdraw() {
    return this._monthlyWithdraw;
  }

  set monthlyWithdraw(value: boolean) {
    this._monthlyWithdraw = value;
    this.emitter.emit();
  }

  get desiredPeriodicWithdraw() {
    return this._desiredPeriodicWithdraw;
  }

  set desiredPeriodicWithdraw(value: number) {
    this._desiredPeriodicWithdraw = value;
    this.emitter.emit();
  }

  get initialTitanoCapital() {
    return this._initialTitanoCapital;
  }

  set initialTitanoCapital(value: number) {
    this._initialTitanoCapital = value;
    this.emitter.emit();
  }

  get titanoPrice() {
    return this._titanoPrice;
  }

  set titanoPrice(value: number) {
    this._titanoPrice = value;
    this.emitter.emit();
  }

  get feesPercentage() {
    return this._feesPercentage;
  }

  set feesPercentage(value: number) {
    this._feesPercentage = value;
    this.emitter.emit();
  }

  get taxesPercentage() {
    return this._taxesPercentage;
  }

  set taxesPercentage(value: number) {
    this._taxesPercentage = value;
    this.emitter.emit();
  }

  dateFormat = 'dd MMMM YYYY';
  shortDateFormat = 'dd MMM YY';
  expandedElement: BalanceRow | undefined;
  currencies = CoinMarketCapCurrencies.CURRENCIES;
  currency = this.currencies[9];
  halfHourAPY = 0.0003958; // from Titano website
  daylyCompoundPeriods = 48;

  displayedColumns: string[] = ['from', 'initialAmount', 'to', 'finalAmount', 'value'];
  mobileColumns: string[] = ['to', 'finalAmount', 'value'];
  dataSource: BalanceRow[] = [];
  newExpandedElement: BalanceRow | null | undefined;

  constructor(private cmcService: CoinMarketCapService, private dialog: MatDialog, private snackBar: MatSnackBar, private window: Window) {
    this.fetchQuote();
    this.dataSource = this.oneYearBalance();
    this.emitter.subscribe(() => this.dataSource = this.oneYearBalance());
  }

  fetchQuote() {
    const c = this.currency;
    this.cmcService.getQuote(c)
      .subscribe(data => {
          // todo ensure we catch errors!
          const price = Object.values(data.data.points).pop().v[0];
          this.titanoPrice = price;
        },
        error => {
          console.error(error);
          this.snackBar.open("Couldn't fetch TITANO quote; please insert it manually", "Ok", {duration: 5000});
        });
  }

  periodicTitanoWithdrawal() {
    return this.amountBeforeFeesAndTaxes();
  }

  periodInDays() {
    return this.monthlyWithdraw ? 31 : 7;
  }

  amountBeforeFeesAndTaxes() {
    // if you consider 18% slippage and 30% taxes, to have 100 Titano net:
    // you need to have 100 / (100 - 30) * 100 = 142,85 tokens => amount  that was taxed
    const beforeTax = (this.desiredPeriodicWithdraw / this.titanoPrice) * 100 / (100 - this.taxesPercentage);
    // 142,85 / (100 - 18) * 100 = 174,21 => amount that was subject to slippage
    return beforeTax * 100 / (100 - this.feesPercentage);
  }

  daysNeeded() {
    // this is the revenue we want to reach at the beginning of the month. Due to autocompound, we will actually exceed
    // the required Titanos at the end of the month, but that's good: it means that even if we withdraw, the wallet will
    // keep grow, not as much as if you never withdraw, but still grows.
    const averageHalfHourRevenue = (this.amountBeforeFeesAndTaxes() / this.periodInDays()) / 48;

    // but when will you hit that magic average value? need to solve an equation on Compound at periond N and N+1
    const n = Math.log(averageHalfHourRevenue / (this.initialTitanoCapital * this.halfHourAPY))
    const d = Math.log(1 + this.halfHourAPY)
    const days = Math.ceil((n / d) / 48)
    // if initial amount is so big to produce negative days, then we can start count 31 days from... today :)
    return (days < 0 ? 0 : days + this.periodInDays());
  }

  firstWithdrawalDate() {
    return (new Date()).plusDays(this.daysNeeded());
  }

  totalTitanoBalance(days: number) {
    // copy/paste this formula in google to see the result by yourself: 1000 * (1 + 0,0003958)^(48*day)
    // taken from https://www.investopedia.com/terms/c/compoundinterest.asp
    return this.initialTitanoCapital * Math.pow(1 + this.halfHourAPY, this.daylyCompoundPeriods * days);
  }

  totalTitanoRevenue(days: number) {
    return this.totalTitanoBalance(days) - this.initialTitanoCapital;
  }

  openHowItWorksDialog() {
    this.window.open('https://github.com/polentino/titano-monthly-revenue-calculator/blob/master/THE_MATH_BEHIND.md', '_blank');
  }

  openBuyMeABeerDialog() {
    this.dialog.open(BuyMeABeerComponent);
  }

  oneYearBalance() {
    const startDate = this.firstWithdrawalDate().minusDays(this.periodInDays());
    startDate.setHours(0, 0, 0, 0);
    const iterations = this.monthlyWithdraw ? 11 : 51;
    const days = this.monthlyWithdraw ? 31 : 7;
    const halfHourAPY = this.halfHourAPY;
    const daylyCompoundPeriods = this.daylyCompoundPeriods;
    const initialCapital = this.initialTitanoCapital;

    function gains(capital: number, days: number) {
      return (capital * Math.pow(1 + halfHourAPY, daylyCompoundPeriods * days));
    }

    const firstPeriodInitialAmount = gains(initialCapital, this.daysNeeded());
    const firstPeriodFinalAmount = gains(firstPeriodInitialAmount, this.periodInDays()) - (this.desiredPeriodicWithdraw / this.titanoPrice);

    const balanceAnalysis: [BalanceRow] = [{
      idx: 0,
      from: startDate,
      to: startDate.plusDays(this.periodInDays()),
      initialAmount: firstPeriodInitialAmount,
      finalAmount: firstPeriodFinalAmount,
      value: this.titanoPrice * firstPeriodFinalAmount
    }];

    for (let i = 0; i <= iterations; i++) {
      const prev = balanceAnalysis[balanceAnalysis.length - 1];
      const finalAmount = gains(prev.finalAmount, days) - (this.desiredPeriodicWithdraw / this.titanoPrice);
      balanceAnalysis.push({
        idx: i + 1,
        from: prev.to,
        to: prev.to.plusDays(this.periodInDays()),
        initialAmount: prev.finalAmount,
        finalAmount: finalAmount,
        value: this.titanoPrice * finalAmount
      });
    }

    return balanceAnalysis;
  }
}

export interface BalanceRow {
  idx: number;
  from: Date;
  to: Date;
  initialAmount: number;
  finalAmount: number;
  value: number
}

export class Balance {
  rows: Array<BalanceRow> = [];
}
