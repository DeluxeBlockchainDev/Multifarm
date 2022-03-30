import { getBridges } from 'services/api/bridges'
import { Bridge } from 'services/types/bridges'
import useSWR from 'swr'

interface UseBridges {
  bridges: Bridge[]
  isLoading: boolean
}

export default function useBridges(): UseBridges {
  const { data, error } = useSWR('/get_bridges', getBridges)

  const isLoading = !data && !error
  const bridges = data || []

  return {
    bridges,
    isLoading
  }
}
