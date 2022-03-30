import makeStyles from '@material-ui/core/styles/makeStyles'
import React, { useEffect, useState } from 'react'

import { getBlockchains } from '../../api/getAllBlockchains'
import search_icon from '../../assets/svg/6_search.svg'
import Announcement from '../../components/Announcement'
import { LineChartFarms } from '../../components/charts/LineChart'
import FarmsFiltersDrawer from '../../components/drawers/FarmsFiltersDrawer'
import { nFormatter, useDebounce } from '../../types/utils'
import { ChainSelector, FarmsList } from '..'
import ActiveFilters from '../asset/ActiveFilters'
import { AdvancedSearch, AdvancedSearchButton, StyledPools } from '../styled'
import styles from './styles.module.scss'

const useStyles = makeStyles({
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px 0 12px 0'
  }
})

const initialFilters: Record<string, any> = {
  tvlMin: 1000000
}

export default function Farms(): JSX.Element {
  const classes = useStyles()
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [chartFetched, sethChartFetched] = useState<any>({})
  const [search, setSearch] = useState('')
  const [filterDrawer, setFilterDrawer] = useState(false)
  const [filters, setFilters] = useState<typeof initialFilters>(initialFilters)

  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const debouncedValue = useDebounce<string>(search, 700)

  useEffect(() => {
    setSearchQuery(debouncedValue)
  }, [debouncedValue])

  useEffect(() => {
    async function fetchBlockchains() {
      const response = await getBlockchains()
      sethChartFetched(response['data'])
    }
    fetchBlockchains()
  }, [])

  const handleChainSelector = (chain: string, only: boolean) => {
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

  const chartData = chartFetched[selectedChains[0] || 'ALL']

  const reversedChart = chartData?.length ? [...chartData].reverse() : []
  const lastTlv = reversedChart[reversedChart.length - 1]?.value

  const handleClearFilter = (key) => {
    setFilters((filters) => ({
      ...filters,
      [key]: key === 'tvlMin' ? 0 : initialFilters[key]
    }))
  }

  return (
    <>
      <StyledPools>
        <Announcement />

        <div className={styles.farms_chart_wrapper}>
          <div className={classes.label}>
            <span>TVL per Blockchain</span>
            <span>
              TVL {selectedChains}:{' '}
              {lastTlv ? '$' + nFormatter(lastTlv) : 'n/a'}
            </span>
          </div>
          <LineChartFarms data={reversedChart} />
          <p>
            <span>{selectedChains[0] ? selectedChains[0] : 'ALL'}</span>
          </p>
        </div>

        <ChainSelector
          selectedChains={selectedChains}
          handleChainSelector={handleChainSelector}
        />

        <AdvancedSearch>
          <div className="search-wrapper">
            <img src={search_icon} alt="graphic" className="search-icon" />
            <input
              value={search}
              onChange={handleChangeSearch}
              placeholder={'Type Asset or Farm'}
            />
          </div>

          <AdvancedSearchButton onClick={() => setFilterDrawer(true)}>
            Advanced Search
          </AdvancedSearchButton>
        </AdvancedSearch>

        <ActiveFilters
          titlesVariant="secondary"
          filters={filters}
          clearFilter={handleClearFilter}
          onClick={() => setFilterDrawer(true)}
        />

        <FarmsList
          blockchains={selectedChains}
          search={searchQuery}
          filters={filters}
        />
      </StyledPools>

      <FarmsFiltersDrawer
        open={filterDrawer}
        onClose={() => setFilterDrawer(false)}
        onApply={setFilters}
        onReset={() => setFilters(initialFilters)}
        filters={filters}
      />
    </>
  )
}
