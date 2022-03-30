import axios, { AxiosInstance } from 'axios'

import { API_SECRET, API_URL } from '../config'

class Api {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: `${API_URL}/${API_SECRET}`
    })
  }

  get(url: string) {
    return this.instance.get(url)
  }
}

export default new Api()
