import useSWR, { cache } from 'swr'

import { getMultiSelects } from '../api/getMultiSelects'

const key = 'get_global_multi_selects'

export default function useMultiSelectValues() {
  const { data } = useSWR(key, getMultiSelects, {
    revalidateOnMount: !cache.has(key),
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  const selectValues = data || {}
  const yieldTypes = selectValues.yield_type_select || []
  const exchangesTypes = selectValues.exchange_select || []
  const farmsOptions = selectValues.farms || []
  return {
    selectValues,
    yieldTypes,
    exchangesTypes,
    farmsOptions
  }
}
