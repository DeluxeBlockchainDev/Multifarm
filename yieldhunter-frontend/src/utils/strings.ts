export function searchHighlight(string, search) {
  return string.replace(
    new RegExp(search, 'gi'),
    (match) => `<span class="search-highlight">${match}</span>`
  )
}
