import axios from 'axios'

import { FarmItem } from '../types/utils'
import { baseUrl } from './constants'
import { secretLink } from './constants'

export const getFarms = (
  filters: Record<string, any>,
  pg?: number,
  blockchains?: string[],
  search?: string | null,
  sort?: {
    value: string
    order: boolean
  }
) => {
  let url = `${baseUrl}/${secretLink}/get_farms${pg ? '?pg=' + pg : ''}${
    blockchains?.length ? '&blockchain=' + blockchains.join(',') : ''
  }`

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

  if (filters.tvlMin) {
    url = url.concat(`&tvl_min=${filters.tvlMin}`)
  }

  return axios.get(url).then((res) => res.data as unknown as FarmItem[])
}

export const getFarmDetails = (farm_id: string) => {
  return axios
    .get(`${baseUrl}/${secretLink}/get_farm_details/${farm_id}`)
    .then((res) => res.data as unknown as FarmItem)
}
