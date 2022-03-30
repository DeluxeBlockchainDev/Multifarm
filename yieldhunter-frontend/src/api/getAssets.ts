import axios from 'axios'

import { checkGroups } from '../utils/filters'
import { baseUrl } from './constants'
import { secretLink } from './constants'

export const getAssets = (
  pg?: number,
  blockchains?: string[],
  filters?: any,
  search?: string | null,
  sort?: {
    value: string
    order: boolean
  },
  farm_id?: string
) => {
  let url = `${baseUrl}/${secretLink}/get_assets${pg ? '?pg=' + pg : ''}`

  const coinGroups = filters.groups?.length
    ? checkGroups(filters.groups)
    : filters.group
    ? [filters.group]
    : []

  if (coinGroups?.length) {
    url = url.concat('&coin_groups=' + coinGroups.map((g) => g.value).join(','))
  }

  if (filters.transferTax) {
    url = url.concat('&transfer_tax_bool=' + filters.transferTax)
  }

  if (filters.harvestLockup) {
    url = url.concat('&harvest_lockup_bool=' + filters.harvestLockup)
  }

  if (filters.depositFee) {
    url = url.concat('&deposit_fee_lte=' + filters.depositFee)
  }

  if (filters.withdrawalFee) {
    url = url.concat('&withdrawal_fee_lte=' + filters.withdrawalFee)
  }

  if (blockchains?.length)
    url = url.concat('&blockchain=' + blockchains.join(','))

  if (filters?.farms) {
    url = url.concat(
      '&farm_ids=' + filters.farms.map((f) => f.farmId).join(',')
    )
  }

  if (filters?.yield_types?.length) {
    url = url.concat('&yield_types=' + filters.yield_types.join(','))
  }

  if (filters?.exchanges?.length) {
    url = url.concat('&exchanges=' + filters.exchanges.join(','))
  }

  if ('active' in filters) {
    url = url.concat('&active=' + filters.active)
  }

  if (filters?.tvlMin) {
    url = url.concat('&tvl_min=' + filters.tvlMin)
  }

  if (filters?.aprYearlyMin) {
    url = url.concat('&apr_yearly_min=' + filters.aprYearlyMin)
  }

  if (filters?.tvlChangeMin) {
    url = url.concat('&tvl_change_min=' + filters.tvlChangeMin)
  }

  if (sort) {
    url = url.concat(
      `${
        '&sort=' + sort.value + '&sort_order=' + (sort.order ? 'desc' : 'asc')
      }`
    )
  }

  if (search) {
    url = url.concat(`${'&search=' + search}`)
  }

  if (farm_id) {
    url = url.concat(`${'&farm_ids=' + farm_id}`)
  }

  return axios.get(url).then((res) => res.data)
}

export const getAssetDetails = (asset_id: string) => {
  return axios
    .get(`${baseUrl}/${secretLink}/get_asset_details/${asset_id}`)
    .then((res) => res.data)
}

export const getAssetsByFarmId = (farm_id: string, assetOrder, assetSort) => {
  return axios
    .get(
      `${baseUrl}/${secretLink}/get_assets?farm_ids=${farm_id}&sort=${assetSort}&sort_order=${
        assetOrder ? 'desc' : 'asc'
      }`
    )
    .then((res) => res.data)
}
