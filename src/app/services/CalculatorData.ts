import {AdvancedCalculatorData} from './AdvancedCalculatorData';
import {ProfitType} from "./ProfitType";
import {WithdrawalPeriod} from './WithdrawalPeriod';

export interface CalculatorData {
  withdrawalPeriod: WithdrawalPeriod;
  profitType: ProfitType;
  desiredPeriodicAmountToWithdraw: number;
  desiredPeriodicRebasePercentageToWithdraw: number;
  startDate: Date;
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
