import axios from 'axios'

import { baseUrl, secretLink } from './constants'

export async function getGroups(url) {
  const response = await axios.get(`${baseUrl}/${secretLink}${url}`)
  return response.data
}
