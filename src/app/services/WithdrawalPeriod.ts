export enum WithdrawalPeriod {
  DAILY,
  WEEKLY,
  MONTHLY
}

export namespace WithdrawalPeriod {
  export function toStringAdjective(wp: WithdrawalPeriod, uppercase = false): string {
    switch (wp) {
      case WithdrawalPeriod.DAILY:
        return uppercase ? 'Daily' : 'daily';
      case WithdrawalPeriod.WEEKLY:
        return uppercase ? 'Weekly' : 'weekly';
      case WithdrawalPeriod.MONTHLY:
        return uppercase ? 'Monthly' : 'monthly';
    }
  }
  export function toStringNoun(wp: WithdrawalPeriod, uppercase = false): string {
    switch (wp) {
      case WithdrawalPeriod.DAILY:
        return uppercase ? 'Day' : 'day';
      default:
        return toStringAdjective(wp, uppercase).replace('ly', '')
    }
  }

  export const values = [WithdrawalPeriod.DAILY, WithdrawalPeriod.WEEKLY, WithdrawalPeriod.MONTHLY];
}
