import {Injectable} from "@angular/core";
import {CalculatorData} from "./CalculatorData";
import {BalanceRow} from "./estimator.service";
import {WithdrawalPeriod} from "./WithdrawalPeriod";


@Injectable({providedIn: 'any'})
export class CalculatorService {

  oneYearBalance(data: CalculatorData): Array<BalanceRow> {
    const days = WithdrawalPeriod.periodToDays(data.withdrawalPeriod);
    const desiredPeriodicRebasePercentageWithdraw = data.desiredPeriodicRebasePercentageToWithdraw;
    const cryptoPrice = data.cryptoPrice;
    const apy = data.advanced.periodAPY;
    const initialCapital = data.initialCryptoCapital;
    const fees = (data.slippageFeesPct + data.advanced.contractSellFeesPct) / 100;
    const totalFees = fees * (!data.countryTaxesCalculationEnabled ? 1 : data.countryTaxes / 100);

    const iterations = WithdrawalPeriod.periodsInYear(data.withdrawalPeriod);
    const dailyCompoundPeriods = Math.trunc(24 * 60 / data.advanced.compoundMinutes);
    const startDate = data.startDate.clone();
    startDate.setHours(0, 0, 0, 0);

    function gains(capital: number, days: number) {
      return (capital * Math.pow(1 + apy, dailyCompoundPeriods * days));
    }

    function rebasesProfit(gains: number, amount: number) {
      return (gains - amount) * desiredPeriodicRebasePercentageWithdraw / 100;
    }

    const firstPeriodInitialAmount = initialCapital;
    const firstPeriodGains = gains(firstPeriodInitialAmount, days)
    const firstPeriodProfit = rebasesProfit(firstPeriodGains, firstPeriodInitialAmount);
    const firstPeriodFinalAmount = firstPeriodGains - firstPeriodProfit;

    const balanceAnalysis: [BalanceRow] = [{
      idx: 0,
      from: startDate,
      to: startDate.plusDays(days),
      initialAmount: firstPeriodInitialAmount,
      finalAmount: firstPeriodFinalAmount,
      value: cryptoPrice * firstPeriodProfit * totalFees
    }];

    for (let i = 0; i < iterations; i++) {
      const prev = balanceAnalysis[balanceAnalysis.length - 1];
      const finalPeriodGains = gains(prev.finalAmount, days)
      const finalPeriodProfit = rebasesProfit(finalPeriodGains, prev.finalAmount);
      const finalAmount = finalPeriodGains - finalPeriodProfit;
      balanceAnalysis.push({
        idx: i + 1,
        from: prev.to,
        to: prev.to.plusDays(days),
        initialAmount: prev.finalAmount,
        finalAmount: finalAmount,
        // note: this is now the value of the profit taken, NOT the value of the titanos remaining in the wallet!
        value: cryptoPrice * finalPeriodProfit * totalFees
      });
    }

    return balanceAnalysis;
  }
}
