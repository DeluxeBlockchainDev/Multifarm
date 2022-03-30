import axios from 'axios'

import { baseUrl } from './constants'
import { secretLink } from './constants'

export const getMultiSelects = async (url) => {
  const response = await axios.get(`${baseUrl}/${secretLink}/${url}`)
  return response.data.data
}

export const getMultiSelectsList = () => {
  const url = `${baseUrl}/${secretLink}/get_global_multi_selects`

  return axios.get(url).then((res) => res.data)
}
