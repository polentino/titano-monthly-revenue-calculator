export enum ProfitType {
  FIXED_AMOUNT,
  REBASE_PERCENTAGE
}

export namespace ProfitType {

  export function toDescription(type: ProfitType) {
    switch (type) {
      case ProfitType.FIXED_AMOUNT:
        return "fixed amount profit";
      case ProfitType.REBASE_PERCENTAGE:
        return "percentage of the rebases profit";
    }
  }

  export const values = [ProfitType.FIXED_AMOUNT, ProfitType.REBASE_PERCENTAGE]
}
