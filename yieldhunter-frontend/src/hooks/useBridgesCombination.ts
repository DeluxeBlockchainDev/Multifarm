import { getBridgesCombination } from 'services/api/bridges'
import useSWR from 'swr'
import { stringifyURL } from 'utils/query'

import { BridgeCombination } from '../services/types/bridges'

function getKey(params) {
  return stringifyURL('/get_bridge_combinations', params)
}

interface BridgesCombinationConfig {
  bridge: string[]
}

interface UseBridgesCombination {
  combinations: BridgeCombination[]
  isLoading: boolean
}

export default function useBridgesCombination({
  bridge
}: BridgesCombinationConfig): UseBridgesCombination {
  const { data, error } = useSWR(
    () => (bridge.length ? getKey({ bridge }) : null),
    getBridgesCombination
  )

  const isLoading = !data && !error
  const combinations = data || []
  return {
    combinations,
    isLoading
  }
}
