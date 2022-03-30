import qs from 'qs'
import query from 'query-string'

export function parseURL(url: string): query.ParsedUrl {
  return query.parseUrl(url)
}

export function stringifyURL(url, params): string {
  return `${url}?${qs.stringify(params, { arrayFormat: 'repeat' })}`
}

export function urlDomain(url: string): string {
  if (typeof URL === 'function') {
    const urlObj = new URL(url)
    return urlObj.hostname
  }
  return url
}
