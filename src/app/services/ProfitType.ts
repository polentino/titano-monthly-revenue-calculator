import {WithdrawalPeriod} from './WithdrawalPeriod';

export enum ProfitType {
  FIXED_AMOUNT,
  REBASE_PERCENTAGE
}

export namespace ProfitType {

  export function toDescription(type: ProfitType, wp?: WithdrawalPeriod) {
    switch (type) {
      case ProfitType.FIXED_AMOUNT:
        return 'periodic, fixed amount';
      case ProfitType.REBASE_PERCENTAGE:
        if (wp) {
          return `% of the ${WithdrawalPeriod.toStringAdjective(wp)} rebases profit`;
        } else {
          return '% of the rebases profit';
        }
    }
  }

  export const values = [ProfitType.FIXED_AMOUNT, ProfitType.REBASE_PERCENTAGE]
}
