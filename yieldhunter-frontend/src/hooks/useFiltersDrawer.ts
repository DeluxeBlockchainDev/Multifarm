import debounce from 'lodash.debounce'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'

interface UseFiltersDrawerConfig<T> {
  filters: T
  onApply: (filters: T) => void
}

interface UseFiltersDrawer<T> {
  innerFilters: T
  onChange: (name: string, value: any) => void
  onArrayUpdate: (name: string, value: any) => void
  onChangeState: Dispatch<SetStateAction<T>>
  onGroupChange: (group: any) => void
  onGroupsChange: (group: any) => void
  onFarmsChange: (farm: any) => void
}

export default function useFiltersDrawer<T>({
  filters,
  onApply
}: UseFiltersDrawerConfig<T>): UseFiltersDrawer<T> {
  const [innerFilters, setInnerFilters] = useState<T>(filters)

  const jsonKey = JSON.stringify(innerFilters)

  const applyFilters = useCallback(
    debounce((filters: T) => {
      onApply(filters)
    }, 1000),
    []
  )

  useEffect(() => {
    if (JSON.stringify(filters) !== jsonKey) {
      applyFilters(innerFilters)
    }
  }, [jsonKey])

  const onChange = (name, value) => {
    setInnerFilters((filters) => ({
      ...filters,
      [name]: value
    }))
  }

  const onArrayUpdate = (name, value) => {
    setInnerFilters((filters) => ({
      ...filters,
      [name]: filters[name].includes(value)
        ? filters[name].filter((v) => v !== value)
        : [...filters[name], value]
    }))
  }

  const onGroupChange = (group) => {
    setInnerFilters((filters: any) => ({
      ...filters,
      group: filters.group?.value === group.value ? null : group,
      groups: []
    }))
  }

  const onGroupsChange = (group) => {
    setInnerFilters((filters: any) => {
      return {
        ...filters,
        group: '',
        groups: filters.groups.find((g) => g.value === group.value)
          ? filters.groups.filter((g) => g.value !== group.value)
          : filters.groups.length === 2
          ? filters.groups
          : [...filters.groups, group]
      }
    })
  }

  const onFarmsChange = (farm) => {
    setInnerFilters((filters: any) => ({
      ...filters,
      farms: filters.farms.find((f) => f.farmId === farm.farmId)
        ? filters.farms.filter((f) => f.farmId !== farm.farmId)
        : [...filters.farms, farm]
    }))
  }

  const onChangeState = setInnerFilters

  return {
    innerFilters,
    onChangeState,
    onChange,
    onArrayUpdate,
    onGroupChange,
    onGroupsChange,
    onFarmsChange
  }
}
