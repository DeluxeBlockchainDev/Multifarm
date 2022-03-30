import useSWR from 'swr'

import { getGroups } from '../api/groups'

export default function useGroups() {
  const { data, error } = useSWR('/get_coins_and_coin_groups', getGroups)
  const isLoading = !data && !error
  const groups = data?.['coin_groups']?.['groups'] || {}
  const coins = data?.['coins'] || {}
  return {
    isLoading,
    groups,
    coins
  }
}
