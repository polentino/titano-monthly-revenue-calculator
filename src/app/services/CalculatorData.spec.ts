import {CalculatorData} from './CalculatorData';
import {WithdrawalPeriod} from './WithdrawalPeriod';

describe('CalculatorData', () => {
  const testData: CalculatorData = {
    withdrawalPeriod: WithdrawalPeriod.WEEKLY,
    desiredPeriodicAmountToWithdraw: 100,
    slippageFeesPct: 2,
    initialCryptoCapital: 1000,
    cryptoPrice: 1, // made up value :)
    countryTaxes: 30,
    countryTaxesCalculationEnabled: true,
    advanced: {
      name: 'TEST',
      compoundMinutes: 30,
      periodAPY: 0.0003958,
      contractSellFeesPct: 18
    }
  };

  describe('clone(data)', () => {
    const cloned = CalculatorData.clone(testData);
    cloned.withdrawalPeriod = WithdrawalPeriod.MONTHLY;
    cloned.desiredPeriodicAmountToWithdraw = 0;
    cloned.slippageFeesPct = 0;
    cloned.initialCryptoCapital = 0;
    cloned.cryptoPrice = 0;
    cloned.countryTaxes = 0;
    cloned.countryTaxesCalculationEnabled = false;
    cloned.advanced.name = 'TITANO';
    cloned.advanced.compoundMinutes = 0;
    cloned.advanced.periodAPY = 0;
    cloned.advanced.contractSellFeesPct = 0;

    it('should produce two distinct objects', () => {

      expect(testData.withdrawalPeriod).toEqual(WithdrawalPeriod.WEEKLY);
      expect(testData.desiredPeriodicAmountToWithdraw).toEqual(100);
      expect(testData.slippageFeesPct).toEqual(2);
      expect(testData.initialCryptoCapital).toEqual(1000);
      expect(testData.cryptoPrice).toEqual(1);
      expect(testData.countryTaxes).toEqual(30);
      expect(testData.countryTaxesCalculationEnabled).toEqual(true);
      expect(testData.advanced.name).toEqual('TEST');
      expect(testData.advanced.compoundMinutes).toEqual(30);
      expect(testData.advanced.periodAPY).toEqual(0.0003958);
      expect(testData.advanced.contractSellFeesPct).toEqual(18);

      expect(cloned.withdrawalPeriod).toEqual(WithdrawalPeriod.MONTHLY);
      expect(cloned.desiredPeriodicAmountToWithdraw).toEqual(0);
      expect(cloned.slippageFeesPct).toEqual(0);
      expect(cloned.initialCryptoCapital).toEqual(0);
      expect(cloned.cryptoPrice).toEqual(0);
      expect(cloned.countryTaxes).toEqual(0);
      expect(cloned.countryTaxesCalculationEnabled).toEqual(false);
      expect(cloned.advanced.name).toEqual('TITANO');
      expect(cloned.advanced.compoundMinutes).toEqual(0);
      expect(cloned.advanced.periodAPY).toEqual(0);
      expect(cloned.advanced.contractSellFeesPct).toEqual(0);
    });
  });

});
