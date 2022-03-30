import useMediaQuery from '@material-ui/core/useMediaQuery'
import { device } from 'utils/screen'

interface UseMediaQueries {
  isMobile: boolean
}

export default function useMediaQueries(): UseMediaQueries {
  const isMobile = useMediaQuery(device.mobileL)
  return {
    isMobile
  }
}
