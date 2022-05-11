import {CalculatorService} from "./calculator.service";
import {CalculatorData} from "./CalculatorData";
import {BalanceRow} from "./estimator.service";
import {ProfitType} from "./ProfitType";
import {WithdrawalPeriod} from "./WithdrawalPeriod";

describe('CalculatorService', () => {
  const service = new CalculatorService();
  const testData: CalculatorData = {
    withdrawalPeriod: WithdrawalPeriod.MONTHLY,
    profitType: ProfitType.REBASE_PERCENTAGE,
    desiredPeriodicAmountToWithdraw: 0,
    desiredPeriodicRebasePercentageToWithdraw: 50,
    startDate: new Date(),
    slippageFeePct: 1,
    initialCryptoCapital: 2000,
    cryptoPrice: 1, // made up value :)
    countryTaxes: 30,
    countryTaxesCalculationEnabled: true,
    advanced: {
      name: 'Titano',
      compoundMinutes: 30,
      periodAPY: 0.0003958,
      contractSellFeesPct: 18
    }
  };

  describe('oneYearBalance', () => {
    it('should compute the expected balance, for a wallet of 2000 TITANO and 50% monthly rebases profit taking', () => {
      const balance = service.oneYearBalance(testData);

      expect(balance.length).toBe(13);
      expectBalance(balance[0], testData.startDate, 0, 2000, 2801.8859, 45.7075);
      expectBalance(balance[12], testData.startDate, 372, 114307.7105, 160138.5852, 2612.3598);
    });
  });

  function expectBalance(row: BalanceRow, startDate: Date, days: number, expectedInitialAmount: number, expectedFinalAmount: number, rebases: number) {
    const firstPeriodStart = startDate.plusDays(days);
    firstPeriodStart.setHours(0, 0, 0, 0);
    const firstPeriodEnd = firstPeriodStart.plusDays(31);
    firstPeriodEnd.setHours(0, 0, 0, 0);

    const firstPeriodFrom = row.from;
    firstPeriodFrom.setHours(0, 0, 0, 0);
    const firstPeriodTo = row.to;
    firstPeriodTo.setHours(0, 0, 0, 0);

    expect(firstPeriodFrom).toEqual(firstPeriodStart);
    expect(firstPeriodTo).toEqual(firstPeriodEnd);

    expect(row.initialAmount).toBeCloseTo(expectedInitialAmount);
    expect(row.finalAmount).toBeCloseTo(expectedFinalAmount);
    expect(row.value).toBeCloseTo(rebases);
  }
});
