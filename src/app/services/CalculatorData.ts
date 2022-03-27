import {AdvancedCalculatorData} from './AdvancedCalculatorData';
import {WithdrawalPeriod} from './WithdrawalPeriod';

export interface CalculatorData {
  withdrawalPeriod: WithdrawalPeriod;
  desiredPeriodicAmountToWithdraw: number;
  slippageFeesPct: number;
  initialCryptoCapital: number;
  cryptoPrice: number
  countryTaxes: number;
  countryTaxesCalculationEnabled: boolean;
  advanced: AdvancedCalculatorData;
}

export namespace CalculatorData {
  export function clone(data: CalculatorData): CalculatorData {
    return {...data, advanced: {...data.advanced}};
  }
}
