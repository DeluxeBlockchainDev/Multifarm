import axios from 'axios'

import { baseUrl } from './constants'
import { secretLink } from './constants'

export const getBlockchains = () => {
  const url = `${baseUrl}/${secretLink}/get_all_blockchain_30d_tvl_graph`

  return axios.get(url).then((res) => res.data)
}
