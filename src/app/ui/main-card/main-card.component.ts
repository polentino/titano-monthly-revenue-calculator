import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HowItWorksComponent} from "../how-it-works/how-it-works.component";
import {BuyMeABeerComponent} from "../buy-me-a-beer/buy-me-a-beer.component";

@Component({
  selector: 'app-main-card',
  templateUrl: './main-card.component.html',
  styleUrls: ['./main-card.component.scss']
})
export class MainCardComponent implements OnInit {

  desiredMonthlyWithdraw: number = 1000;
  initialTitanoCapital: number = 2000;
  titanoPrice: number = 0.157907;
  feesPercentage: number = 18;
  taxesPercentage: number = 30;
  dateFormat = 'dd MMMM YYYY';

  halfHourAPY = 0.0003958; // from Titano website
  daylyCompoundPeriods = 48;

  constructor(public dialog: MatDialog) {
  }

  monthlyTitanoWithdrawal() {
    return this.amountBeforeFees();
  }

  amountBeforeFees() {
    // if you consider 18% slippage and 30% taxes, to have 100 Titano net:
    // you need to have 100 / (100 - 30) * 100 = 142,85 tokens => amount  that was taxed
    const beforeTax = (this.desiredMonthlyWithdraw / this.titanoPrice) * 100 / (100 - this.taxesPercentage);
    // 142,85 / (100 - 18) * 100 = 174,21 => amount that was subject to slippage
    return beforeTax * 100 / (100 - this.feesPercentage);
  }

  daysNeeded() {
    // this is the revenue we want to reach at the beginning of the month. Due to autocompound, we will actually exceed
    // the required Titanos at the end of the month, but that's good: it means that even if we withdraw, the wallet will
    // keep grow, not as much as if you never withdraw, but still grows.
    const averageHalfHourRevenue = (this.amountBeforeFees() / 31) / 48;

    // but when will you hit that magic average value? need to solve an equation on Compound at periond N and N+1
    const n = Math.log(averageHalfHourRevenue / (this.initialTitanoCapital * this.halfHourAPY))
    const d = Math.log(1 + this.halfHourAPY)
    const days = Math.ceil((n / d) / 48)
    // if initial amount is so big to produce negative days, then we can start count 31 days from... today :)
    return (days < 0 ? 0 : days) + 31;
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

  ngOnInit(): void {
  }
}
