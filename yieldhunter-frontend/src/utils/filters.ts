import { nFormatter } from '../types/utils'

export const TITLES = {
  tvlMin: 'Liquidity higher than',
  aprYearlyMin: 'APR (y) higher than',
  tvlChangeMin: 'TVL Change (24h) higher than',
  group: 'Coin Single Group',
  groups: 'Coin Pair Groups',
  yield_types: 'Yield Type',
  exchanges: 'Exchange',
  farms: 'Farms',
  harvestLockup: 'Harvest Lockup',
  transferTax: 'Transfer Tax',
  depositFee: 'Deposit Fee lower than',
  withdrawalFee: 'Withdrawal Fee lower than'
}

export const TITLES_SECONDARY = {
  ...TITLES,
  tvlMin: 'TVL higher than'
}

export function checkGroups(groups) {
  return groups.length === 1 ? [...groups, ...groups] : groups
}

const renderPercent = (value) => value + '%'
const renderMoney = (value) => '$' + nFormatter(value, 0)
const renderBoolean = (value) => (`${value}` === 'true' ? 'Yes' : 'No')
const renderArray = (value) => value.join(', ')
const renderGroups = (value) =>
  checkGroups(value)
    .map((group) => group.label)
    .join(', ')
const renderGroup = (value) => value.label
const renderFarms = (value) => value.map((farm) => farm.name).join(', ')

export const RENDER_VALUE = {
  withdrawalFee: renderPercent,
  depositFee: renderPercent,
  aprYearlyMin: renderPercent,
  tvlChangeMin: renderPercent,
  tvlMin: renderMoney,
  transferTax: renderBoolean,
  harvestLockup: renderBoolean,
  yield_types: renderArray,
  exchanges: renderArray,
  group: renderGroup,
  groups: renderGroups,
  farms: renderFarms
}

export const STATUS_FILTERS = [
  {
    label: 'Active',
    value: 'active'
  },
  {
    label: 'Inactive',
    value: 'inactive'
  },
  {
    label: 'Disabled Under Review',
    value: 'disabled_under_review'
  },
  {
    label: 'Permanently Disabled',
    value: 'permanently_disabled'
  },
  {
    label: 'Temporarily Disabled',
    value: 'temporarily_disabled'
  }
]

export const BOOL_FILTERS = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
]

// 0, 10k, 50k, 100k, 500k, 1m, 5m, 10m, 50m, 100m, 500m 1b
export const FILTER_STEPS = [
  0, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000,
  100000000, 500000000, 1000000000
]

const FILTER_STEP = 500000

export function decrease(prevState) {
  const curIndex = FILTER_STEPS.indexOf(prevState)
  if (curIndex !== -1 && typeof FILTER_STEPS[curIndex - 1] === 'number') {
    return FILTER_STEPS[curIndex - 1]
  }
  return prevState === 0 ? 0 : prevState - FILTER_STEP
}

export function increase(prevState) {
  const curIndex = FILTER_STEPS.indexOf(prevState)
  if (curIndex !== -1 && FILTER_STEPS[curIndex + 1]) {
    return FILTER_STEPS[curIndex + 1]
  }
  return prevState + FILTER_STEP
}

export function increasePercent(prevState) {
  return prevState + 10
}

export function decreasePercent(prevState) {
  return prevState - 10 <= 0 ? 0 : prevState - 10
}
