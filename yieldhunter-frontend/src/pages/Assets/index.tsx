import useMediaQuery from '@material-ui/core/useMediaQuery'
import React, { useEffect, useState } from 'react'

import search_icon from '../../assets/svg/6_search.svg'
import AssetsFiltersDrawer from '../../components/drawers/AssetsFiltersDrawer'
import { useDebounce } from '../../types/utils'
import { device } from '../../utils/screen'
import { AssetsList, ChainSelector } from '..'
import ActiveFilters from '../asset/ActiveFilters'
import {
  AdvancedSearch,
  AdvancedSearchButton,
  AdvancedSearchInputContainer,
  StyledPools
} from '../styled'

export const initialFilters = {
  tvlMin: 50000,
  aprYearlyMin: 0,
  tvlChangeMin: 0,
  group: null,
  groups: [],
  yield_types: [],
  exchanges: [],
  farms: [],
  harvestLockup: '',
  transferTax: '',
  depositFee: 0,
  withdrawalFee: 0
}

export default function Assets(): JSX.Element {
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const isLaptop = useMediaQuery(device.laptop)

  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const debouncedValue = useDebounce<string>(search, 700)

  useEffect(() => {
    setSearchQuery(debouncedValue)
  }, [debouncedValue])

  const [filters, setFilters] = useState<any>(initialFilters)

  const [showFilters, setShowFilters] = useState(false)

  const handleChainsSelector = (chain: string, only: boolean) => {
    if (only) return setSelectedChains([chain])
    const temp =
      chain === 'All'
        ? []
        : selectedChains.includes(chain)
        ? selectedChains.filter((item) => item !== chain)
        : [...selectedChains, chain]
    setSelectedChains(temp)
  }

  const handleChangeSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleClearFilter = (key) => {
    setFilters((filters) => ({
      ...filters,
      [key]: key === 'tvlMin' ? 0 : initialFilters[key]
    }))
  }

  return (
    <>
      <StyledPools>
        <ChainSelector
          selectedChains={selectedChains}
          handleChainSelector={handleChainsSelector}
        />

        <AdvancedSearch>
          <AdvancedSearchInputContainer>
            <div className="search-wrapper">
              <img src={search_icon} alt="graphic" className="search-icon" />
              <input
                value={search}
                onChange={handleChangeSearch}
                placeholder={isLaptop ? 'Search' : 'Type Asset or Farm'}
              />
            </div>

            <AdvancedSearchButton onClick={() => setShowFilters(true)}>
              Advanced Search
            </AdvancedSearchButton>
          </AdvancedSearchInputContainer>
        </AdvancedSearch>

        <ActiveFilters
          filters={filters}
          clearFilter={handleClearFilter}
          onClick={() => setShowFilters(true)}
        />

        <AssetsList
          blockchains={selectedChains}
          search={searchQuery}
          filters={filters}
        />
      </StyledPools>

      <AssetsFiltersDrawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={(filters) => setFilters(filters)}
        onReset={() => setFilters(initialFilters)}
      />
    </>
  )
}
