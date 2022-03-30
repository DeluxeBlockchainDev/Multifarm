import Api from '../Api'

export async function getBridges(url) {
  const response = await Api.get(url)
  return response.data
}

export async function getBridgesCombination(url) {
  const response = await Api.get(url)
  return response.data
}
