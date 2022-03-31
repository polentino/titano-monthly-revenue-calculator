import {Injectable} from '@angular/core';
import {CalculatorData} from "./CalculatorData";
import {WithdrawalPeriod} from './WithdrawalPeriod';

@Injectable({providedIn: 'any'})
export class CalculatorService {

  amountBeforeFeesAndTaxes(data: CalculatorData) {
    // if you consider 18% slippage and 30% taxes, to have 100 Titano net:
    // you need to have 100 * ((100 / )(100 - 30)) = 142,85 tokens => amount  that was taxed
    const taxes = data.countryTaxesCalculationEnabled ? 100 / (100 - data.countryTaxes) : 1;
    const beforeTax = (data.desiredPeriodicAmountToWithdraw / data.cryptoPrice) * taxes;
    // 142,85 / (100 - 18) * 100 = 174,21 => amount that was subject to slippage
    return beforeTax * 100 / (100 - (data.advanced.contractSellFeesPct + data.slippageFeesPct));
  }

  daysNeeded(data: CalculatorData) {
    // this is the revenue we want to reach at the beginning of the month. Due to autocompound, we will actually exceed
    // the required Titanos at the end of the month, but that's good: it means that even if we withdraw, the wallet will
    // keep grow, not as much as if you never withdraw, but still grows.
    const dailyCompoundPeriods = Math.trunc(24 * 60 / data.advanced.compoundMinutes);
    const averageHalfHourRevenue = (this.amountBeforeFeesAndTaxes(data) / CalculatorService.periodToDays(data)) / dailyCompoundPeriods;
    const singlePeriodAPY = data.advanced.periodAPY;

    // but when will you hit that magic average value? need to solve an equation on Compound at period N and N+1
    const n = Math.log(averageHalfHourRevenue / (data.initialCryptoCapital * singlePeriodAPY))
    const d = Math.log(1 + singlePeriodAPY)
    const days = Math.ceil((n / d) / dailyCompoundPeriods)
    // if initial amount is so big to produce negative days, then we don't have to wait to start withdrawing money
    return (days < 0 ? 0 : days + CalculatorService.periodToDays(data));
  }

  firstWithdrawalDate(data: CalculatorData) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const calculationDate = data.startDate.clone();
    calculationDate.setHours(0, 0, 0, 0);
    const daysNeeded = this.daysNeeded(data);

    if (calculationDate.getTime() >= today.getTime()) {
      return today.plusDays(daysNeeded);
    } else {
      const daysBetween = today.daysBetween(calculationDate);
      const daysLeft = daysNeeded - daysBetween;
      return daysLeft >= 0 ? today.plusDays(daysLeft) : today.minusDays(-daysLeft);
    }
  }

  oneYearBalance(data: CalculatorData): Array<BalanceRow> {
    const days = CalculatorService.periodToDays(data);
    const desiredPeriodicWithdraw = data.desiredPeriodicAmountToWithdraw;
    const cryptoPrice = data.cryptoPrice;
    const apy = data.advanced.periodAPY;
    const initialCapital = data.initialCryptoCapital;

    const iterations = CalculatorService.periodsInYear(data);
    const dailyCompoundPeriods = Math.trunc(24 * 60 / data.advanced.compoundMinutes);
    const startDate = this.firstWithdrawalDate(data).minusDays(days);
    startDate.setHours(0, 0, 0, 0);

    function gains(capital: number, days: number) {
      return (capital * Math.pow(1 + apy, dailyCompoundPeriods * days));
    }

    const firstPeriodInitialAmount = gains(initialCapital, this.daysNeeded(data));
    const firstPeriodFinalAmount = gains(firstPeriodInitialAmount, days) - (desiredPeriodicWithdraw / cryptoPrice);

    const balanceAnalysis: [BalanceRow] = [{
      idx: 0,
      from: startDate,
      to: startDate.plusDays(days),
      initialAmount: firstPeriodInitialAmount,
      finalAmount: firstPeriodFinalAmount,
      value: cryptoPrice * firstPeriodFinalAmount
    }];

    for (let i = 0; i <= iterations; i++) {
      const prev = balanceAnalysis[balanceAnalysis.length - 1];
      const finalAmount = gains(prev.finalAmount, days) - (desiredPeriodicWithdraw / cryptoPrice);
      balanceAnalysis.push({
        idx: i + 1,
        from: prev.to,
        to: prev.to.plusDays(days),
        initialAmount: prev.finalAmount,
        finalAmount: finalAmount,
        value: cryptoPrice * finalAmount
      });
    }

    return balanceAnalysis;
  }

  estimatedOneYearProfit(data: CalculatorData) {
    return CalculatorService.periodsInYear(data) * data.desiredPeriodicAmountToWithdraw;
  }

  private static periodToDays(data: CalculatorData) {
    switch (data.withdrawalPeriod) {
      case WithdrawalPeriod.DAILY:
        return 1;
      case WithdrawalPeriod.WEEKLY:
        return 7;
      case WithdrawalPeriod.MONTHLY:
        return 31;
    }
  }

  private static periodsInYear(data: CalculatorData) {
    switch (data.withdrawalPeriod) {
      case WithdrawalPeriod.DAILY:
        return 365;
      case WithdrawalPeriod.WEEKLY:
        return 52;
      case WithdrawalPeriod.MONTHLY:
        return 12;
    }
  }
}

export interface BalanceRow {
  idx: number;
  // todo: do not use Date, but rather, days increment. it will make testing easier
  // better also enclose everything in a Balance class, which contains the initial date for reference to which add days
  from: Date;
  to: Date;
  initialAmount: number;
  finalAmount: number;
  value: number
}

export const TITANO_DATA: CalculatorData = {
  withdrawalPeriod: WithdrawalPeriod.MONTHLY,
  desiredPeriodicAmountToWithdraw: 1000,
  startDate: new Date(),
  slippageFeesPct: 1,
  initialCryptoCapital: 2000,
  cryptoPrice: 0.157907,
  countryTaxes: 30,
  countryTaxesCalculationEnabled: false,
  advanced: {
    name: 'Titano',
    compoundMinutes: 30,
    periodAPY: 0.0003958, // from TITANO website
    contractSellFeesPct: 18
  }
};
