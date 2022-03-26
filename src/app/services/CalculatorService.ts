import {Injectable} from "@angular/core";

@Injectable({providedIn: "any"})
export class CalculatorService {

  amountBeforeFeesAndTaxes(data: CalculatorData) {
    // if you consider 18% slippage and 30% taxes, to have 100 Titano net:
    // you need to have 100 * ((100 / )(100 - 30)) = 142,85 tokens => amount  that was taxed
    const taxes = data.countryTaxesCalculationEnabled ? 100 / (100 - data.countryTaxes) : 1;
    const beforeTax = (data.desiredPeriodicAmountToWithdraw / data.advanced.cryptoPrice) * taxes;
    // 142,85 / (100 - 18) * 100 = 174,21 => amount that was subject to slippage
    return beforeTax * 100 / (100 - (data.advanced.contractSellFeePct + data.slippageFeePct));
  }

  daysNeeded(data: CalculatorData) {
    // this is the revenue we want to reach at the beginning of the month. Due to autocompound, we will actually exceed
    // the required Titanos at the end of the month, but that's good: it means that even if we withdraw, the wallet will
    // keep grow, not as much as if you never withdraw, but still grows.
    const dailyCompoundPeriods = Math.trunc(24 * 60 / data.advanced.compoundMinutes);
    const averageHalfHourRevenue = (this.amountBeforeFeesAndTaxes(data) / CalculatorService.periodToDays(data)) / dailyCompoundPeriods;
    const singlePeriodAPY = data.advanced.periodAPY;

    // but when will you hit that magic average value? need to solve an equation on Compound at periond N and N+1
    const n = Math.log(averageHalfHourRevenue / (data.initialCryptoCapital * singlePeriodAPY))
    const d = Math.log(1 + singlePeriodAPY)
    const days = Math.ceil((n / d) / dailyCompoundPeriods)
    // if initial amount is so big to produce negative days, then we don't have to wait to start withdrawing money
    return (days < 0 ? 0 : days + CalculatorService.periodToDays(data));
  }

  firstWithdrawalDate(data: CalculatorData) {
    return (new Date()).plusDays(this.daysNeeded(data));
  }

  oneYearBalance(data: CalculatorData): Array<BalanceRow> {
    const days = CalculatorService.periodToDays(data);
    const desiredPeriodicWithdraw = data.desiredPeriodicAmountToWithdraw;
    const cryptoPrice = data.advanced.cryptoPrice;
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

export enum WithdrawalPeriod {
  DAILY,
  WEEKLY,
  MONTHLY
}

export interface AdvancedCalculatorData {
  compoundMinutes: number
  periodAPY: number
  cryptoPrice: number
  // todo: these are the REAL slippage fees, which every contract sets to a different value
  contractSellFeePct: number
}

export interface CalculatorData {
  withdrawalPeriod: WithdrawalPeriod
  desiredPeriodicAmountToWithdraw: number
  slippageFeePct: number
  initialCryptoCapital: number
  countryTaxes: number
  countryTaxesCalculationEnabled: boolean
  advanced: AdvancedCalculatorData
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
