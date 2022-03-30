import { useEffect, useState } from 'react'

import { getMultiSelectsList } from '../api/getMultiSelects'

export interface AssetItem {
  tvlChange24h: 'n/a'
  tvlChange24hValue: 0
  rewardTokenPriceHistory: []
  tvlStakedHistory: [
    {
      date: '2021.07.02'
      value: 857311.34
    }
  ]
  aprHistory: [
    {
      date: '2021.07.02'
      value: 0.23
    }
  ]
  active: boolean
  aprDaily: any
  aprWeekly: any
  aprYearly: any
  apyYearly: any
  asset: string
  assetAddress: string
  assetId: string
  assetLockup: boolean
  assetPopupMessage: string
  assetPrice: number
  auditInfo: string
  blockchain: string
  category: string
  collateralLockPeriod: string
  dateAdded: string
  dateEnding: string
  dateStarted: string
  dateUpdated: string
  daysRemaining: string
  depositFee: string
  exchangeName: string
  exchangePicture: string
  exchangeUrl: string
  exchangeVersion: string
  farm: string
  farmId: string
  farmImage: string
  harvestLockup: false
  impermanentLoss: string
  impermanentLoss30d: string
  info: string
  investmentLink: string
  manuallyCalculatedAPR: false
  maxPoolCap: string
  multiplier: string
  nativeToken: string
  nativeTokenAddress: string
  nativeTokenInvestLink: string
  nativeTokenMarketCap: string
  nativeTokenPrice: string
  otherFees: string
  pid: string
  poolAlreadyFilled: false
  priceCorrelation_30d: string
  rewardTokenA: string
  rewardTokenAAddress: string
  rewardTokenAPrice: number
  rewardTokenAWeeklyAmount: number
  rewardTokenAWeeklyDollarAmount: number
  rewardTokenB: string
  rewardTokenBAddress: string
  rewardTokenBPrice: string
  rewardTokenBWeeklyAmount: string
  rewardTokenBWeeklyDollarAmount: string
  scam: false
  scamInfo: string
  source: string
  stakingAddress: string
  stakingLink: string
  tokenA: string
  tokenAAddress: string
  tokenAPicture: string
  tokenAPrice: string
  tokenB: string
  tokenBAddress: string
  tokenBPicture: string
  tokenBPrice: string
  tokenC: string
  tokenCAddress: string
  tokenCPicture: string
  tokenCPrice: string
  tokenD: string
  tokenDAddress: string
  tokenDPicture: string
  tokenDPrice: string
  tvlExchange: number
  tvlStaked: number
  tvlStakedChange_1d: string
  underlyingFarm: string
  url: string
  vaultAddress: string
  vesting: string
  volume_24h: string
  weight: string
  withdrawalFee: string
  yearlyTokenRewardPool: number
  yieldType: string
  colorizedHtml: string
}

export interface FarmItemDetails {
  active: boolean
  blockchain: string
  dateAdded: string
  dateUpdated: string
  farmId: string
  farmName: string
  source: string
  url: string
  tvlStaked: string
  native_token: string
  native_token_price: string
  liquidity_increase: null
}
export interface FarmItem {
  active: boolean
  blockchain: string
  dateAdded: string
  dateUpdated: string
  farmId: string
  farmName: string
  lastFullUpdate: string
  tvlChange24h: string
  tvlChange24hValue: number
  tvlStaked: number
  tvlStakedHistory: { date: string; value: number }[]
  farmType: ''
  scam: false
  scamInfo: ''
  colorizedHtml?: ''
}

export const chains = () => {
  let temp
  const tempChains = {}
  async function fetchMultiSelects() {
    temp = await getMultiSelectsList()
    temp['data']['chains_available'].forEach((chain: string) => {
      tempChains[`${chain.toLowerCase()}`] = chain
    })
  }
  fetchMultiSelects()
  return tempChains
}

export const nFormatter = (num: number, fixed = 2): string => {
  let isNegative = false
  let formattedNumber
  if (num < 0) {
    isNegative = true
  }
  num = Math.abs(num)
  if (num >= 1000000000) {
    formattedNumber =
      (num / 1000000000).toFixed(fixed).replace(/\.0$/, '') + ' B'
  } else if (num >= 1000000) {
    formattedNumber = (num / 1000000).toFixed(fixed).replace(/\.0$/, '') + ' M'
  } else if (num >= 1000) {
    formattedNumber = (num / 1000).toFixed(fixed).replace(/\.0$/, '') + ' k'
  } else {
    formattedNumber = num
  }
  if (isNegative) {
    formattedNumber = '-' + formattedNumber
  }
  return formattedNumber
}

export function createMarkup(str: string) {
  return { __html: str }
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
