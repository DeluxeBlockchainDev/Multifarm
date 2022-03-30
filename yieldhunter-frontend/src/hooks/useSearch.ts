import debounce from 'lodash.debounce'
import { useState } from 'react'

export function useSearch() {
  const [search, setSearch] = useState('')

  const onSearch = debounce((e) => {
    setSearch(e.target.value)
  }, 400)

  return {
    search,
    onSearch
  }
}
