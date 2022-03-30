export interface Bridge {
  bridgeName: string
  blockchains: string[]
}

export interface BridgeCombination {
  bridgeName: string
  comment: string
  blockchains: string[]
  url: string
  fee: string
}
