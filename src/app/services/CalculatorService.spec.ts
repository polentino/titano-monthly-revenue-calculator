import {CalculatorData} from './CalculatorData';
import {BalanceRow, CalculatorService} from './CalculatorService';
import {WithdrawalPeriod} from './WithdrawalPeriod';

describe('CalculatorService', () => {
  const service = new CalculatorService();
  const testData: CalculatorData = {
    withdrawalPeriod: WithdrawalPeriod.WEEKLY,
    desiredPeriodicAmountToWithdraw: 100,
    slippageFeesPct: 2,
    initialCryptoCapital: 1000,
    countryTaxes: 30,
    countryTaxesCalculationEnabled: true,
    advanced: {
      compoundMinutes: 30,
      periodAPY: 0.0003958,
      cryptoPrice: 1, // made up value :)
      contractSellFeesPct: 18
    }
  };

  describe('amountBeforeFeesAndTaxes', () => {
    it('to withdraw 100$ net, if total sell taxes are 20%, without Country taxes, I need 125$ gross', () => {
      const data = CalculatorData.clone(testData);
      data.countryTaxesCalculationEnabled = false;
      expect(service.amountBeforeFeesAndTaxes(data)).toEqual(125);
    });

    it('to withdraw 100$ net, if total sell taxes are 20%, Country taxes are 30%, I need 178.5714$ gross', () => {
      const data = CalculatorData.clone(testData);
      expect(service.amountBeforeFeesAndTaxes(data)).toBeCloseTo(178.5714);
    });
  });

  describe('daysNeeded', () => {
    it('to withdraw 500$ net monthly, with 1000$ capital, sell taxes are 20%, without Country taxes, I need 35 days', () => {
      const data = CalculatorData.clone(testData);
      data.withdrawalPeriod = WithdrawalPeriod.MONTHLY;
      data.desiredPeriodicAmountToWithdraw = 500;
      data.countryTaxesCalculationEnabled = false;
      expect(service.daysNeeded(data)).toEqual(35);
    });

    it('to withdraw 500$ net monthly, with 1000$ capital, sell taxes 20%, Country taxes are 30%, I need 53 days', () => {
      const data = CalculatorData.clone(testData);
      data.withdrawalPeriod = WithdrawalPeriod.MONTHLY;
      data.desiredPeriodicAmountToWithdraw = 500;
      expect(service.daysNeeded(data)).toEqual(53);
    });

    it('to withdraw 500$ net weekly, with 1000$ capital, sell taxes are 20%, without Country taxes, I need 89 days', () => {
      const data = CalculatorData.clone(testData);
      data.desiredPeriodicAmountToWithdraw = 500;
      data.countryTaxesCalculationEnabled = false;
      expect(service.daysNeeded(data)).toEqual(89);
    });

    it('to withdraw 500$ net weekly, with 1000$ capital, sell taxes 20%, Country taxes are 30%, I need 108 days', () => {
      const data = CalculatorData.clone(testData);
      data.desiredPeriodicAmountToWithdraw = 500;
      expect(service.daysNeeded(data)).toEqual(108);
    });

    it('corner case: to withdraw 10$ net weekly, with 1000$ capital, sell taxes 20%, Country taxes are 30%, I need 0 days', () => {
      const data = CalculatorData.clone(testData);
      data.desiredPeriodicAmountToWithdraw = 10;
      // the capital is so disproportionate wrt the amount to withdraw, that I can start withdrawing it right away
      expect(service.daysNeeded(data)).toEqual(0);
    });
  });

  describe('oneYearBalance', () => {
    it('to withdraw 500$ net monthly, with 1000$ capital, sell taxes are 20%, Country taxes are 30%, the 1-Year balance is', () => {
      const data = CalculatorData.clone(testData);
      data.withdrawalPeriod = WithdrawalPeriod.MONTHLY;
      data.desiredPeriodicAmountToWithdraw = 500;
      const balance = service.oneYearBalance(data);

      expectBalance(balance[0], 22, 2736.5992, 4431.0397);
      expectBalance(balance[12], 394, 2476000.5535, 4460970.6589);
    });
  });

  function expectBalance(row: BalanceRow, days: number, expectedInitialAmount: number, expectedFinalAmount: number) {
    const firstPeriodStart = (new Date()).plusDays(days);
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
  }
});
