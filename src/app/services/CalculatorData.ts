import {AdvancedCalculatorData} from './AdvancedCalculatorData';
import {ProfitType} from './ProfitType';
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
  const DATE_KEY: string = 'startDate';
  const DATE_SUFFIX: string = 'date:';

  export function clone(data: CalculatorData): CalculatorData {
    return {...data, advanced: {...data.advanced}};
  }

  export function toJSON(data: CalculatorData): string {
    return JSON.stringify(data, dateReplacer)
  }

  function dateReplacer(key: string, value: any): string {
    if (value instanceof Date && key === DATE_KEY) {
      return DATE_SUFFIX + value.toJSON();
    }
    return value;
  }

  export function fromJSON(data: string): CalculatorData {
    return JSON.parse(data, dateReviver) as CalculatorData;
  }

  function dateReviver(key: string, value: any): any {
    if (key === DATE_KEY) {
      return new Date(value.toString().replace(DATE_SUFFIX, ''));
    }
    return value;
  }
}
