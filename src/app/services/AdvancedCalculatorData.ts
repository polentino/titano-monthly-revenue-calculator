export interface AdvancedCalculatorData {
  compoundMinutes: number
  periodAPY: number
  cryptoPrice: number
  // todo: these are the REAL slippage fees, which every contract sets to a different value
  contractSellFeesPct: number
}
