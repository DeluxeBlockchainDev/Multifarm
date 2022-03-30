import axios from 'axios'

import { baseUrl, secretLink } from './constants'

export async function getAnnouncement(url) {
  const response = await axios.get(`${baseUrl}/${secretLink}${url}`)
  return {
    announcement: response.data.announcement,
    updatedOn: response.data.announcementUpdated
  }
}
