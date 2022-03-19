import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CoinMarketCapCurrencies} from "../../services/CoinMarketCapCurrencies";
import { CoinMarketCapService} from "../../services/CoinMarketCapService";
import {BuyMeABeerComponent} from "../buy-me-a-beer/buy-me-a-beer.component";
import {HowItWorksComponent} from "../how-it-works/how-it-works.component";

@Component({
  selector: 'app-main-card',
  templateUrl: './main-card.component.html',
  styleUrls: ['./main-card.component.scss'],
  providers: [CoinMarketCapService]
})
export class MainCardComponent {

  monthlyWithdraw = true;
  desiredPeriodicWithdraw = 1000;
  initialTitanoCapital = 2000;
  titanoPrice = 0.157907;
  feesPercentage = 18;
  taxesPercentage = 30;
  dateFormat = 'dd MMMM YYYY';
  //
  currencies = CoinMarketCapCurrencies.CURRENCIES;
  currency = this.currencies[9];

  halfHourAPY = 0.0003958; // from Titano website
  daylyCompoundPeriods = 48;

  constructor(private cmcService: CoinMarketCapService, private dialog: MatDialog) {
    this.fetchQuote();
  }

  fetchQuote() {
    this.cmcService.getQuote(this.currency)
      .subscribe(data => {
        // todo ensure we catch errors!
        this.titanoPrice = Object.values(data.data.points).pop().v[0];
      });
  }

  periodicTitanoWithdrawal() {
    return this.amountBeforeFees();
  }

  periodInDays() {
    return this.monthlyWithdraw ? 31 : 7;
  }

  amountBeforeFees() {
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
    const averageHalfHourRevenue = (this.amountBeforeFees() / this.periodInDays()) / 48;

    // but when will you hit that magic average value? need to solve an equation on Compound at periond N and N+1
    const n = Math.log(averageHalfHourRevenue / (this.initialTitanoCapital * this.halfHourAPY))
    const d = Math.log(1 + this.halfHourAPY)
    const days = Math.ceil((n / d) / 48)
    // if initial amount is so big to produce negative days, then we can start count 31 days from... today :)
    return (days < 0 ? 0 : days) + this.periodInDays();
  }

  startDate() {
    const date = new Date();
    date.setDate(date.getDate() + this.daysNeeded());
    return date;
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
    this.dialog.open(HowItWorksComponent);
  }

  openBuyMeABeerDialog() {
    this.dialog.open(BuyMeABeerComponent);
  }
}
