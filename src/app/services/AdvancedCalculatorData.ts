export interface AdvancedCalculatorData {
  name: string
  compoundMinutes: number
  periodAPY: number
  // todo: these are the REAL slippage fees, which every contract sets to a different value
  contractSellFeesPct: number
}
