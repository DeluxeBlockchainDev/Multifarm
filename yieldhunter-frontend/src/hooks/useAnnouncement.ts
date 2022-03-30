import useSWR from 'swr'

import { getAnnouncement } from '../api/globals'

export default function useAnnouncement(): any {
  const { data, error } = useSWR('/get_global_multi_selects', getAnnouncement)
  const isLoading = !data && !error
  const announcement = data || {}
  return {
    isLoading,
    announcement
  }
}
