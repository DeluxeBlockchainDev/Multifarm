import React, { useEffect } from 'react'
import { useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { getAssets } from '../api/getAssets'
import { getFarms } from '../api/getFarms'
import { getMultiSelectsList } from '../api/getMultiSelects'
import arrow from '../assets/svg/arrow-right.svg'
import BottomPagination from '../components/BottomPagination'
import { Asset } from '../components/PoolsTable/Asset'
import { Farm } from '../components/PoolsTable/Farm'
import {
  PoolsListItems,
  PoolsLitItemsContainer,
  StyledPoolsList
} from '../components/PoolsTable/styled'
import { FarmItem } from '../types/utils'
import { AssetItem } from '../types/utils'
import { BlockChains } from './styled'

export const ChainSelector = ({
  selectedChains,
  handleChainSelector
}: {
  selectedChains: string[]
  handleChainSelector: (chain: string, only: boolean) => void
}) => {
  const [chains, setChains] = useState<{} | null>(null)

  useEffect(() => {
    async function fetchMultiSelects() {
      const tempChains = {}
      const temp = await getMultiSelectsList()
      temp['data']['chains_available'].forEach((chain: string) => {
        tempChains[`${chain.toLowerCase()}`] = chain
      })
      setChains(tempChains)
    }
    fetchMultiSelects()
  }, [])

  return chains ? (
    <BlockChains>
      <span
        className={`${!selectedChains.length ? 'active' : null}`}
        onClick={() => handleChainSelector('All', false)}
        key="all"
      >
        All
      </span>
      {Object.keys(chains).map((chain) => {
        return (
          <span
            className={`${
              selectedChains.includes(chains[chain]) ? 'active' : null
            }`}
            onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
              if (e.ctrlKey) {
                handleChainSelector(chains[chain], false)
              } else {
                handleChainSelector(chains[chain], true)
              }
            }}
            key={chain}
          >
            {chains[chain]}
          </span>
        )
      })}
    </BlockChains>
  ) : null
}

const usePagination = (pages: number) => {
  const [page, setPage] = useState(0)

  const reset = () => {
    setPage(0)
  }

  const handleBack = () => {
    return page === 0 ? null : setPage((prev) => prev - 1)
  }

  const handleNext = () => {
    return page + 1 < pages ? setPage((prev) => prev + 1) : null
  }

  useEffect(() => {
    if (page < pages) return
    reset()
  }, [page, pages])

  const onChangePage = (page) => {
    setPage(page)
  }

  return { page, handleBack, handleNext, reset, onChangePage }
}

const Pagination = ({
  page,
  pages,
  handleBack,
  handleNext
}: {
  page: number
  pages: number
  handleBack: () => void
  handleNext: () => void
}) => {
  return (
    <div className="pagination-wrapper">
      <img
        src={arrow}
        alt="back"
        onClick={handleBack}
        style={{
          transform: 'rotate(180deg)',
          filter: `grayscale(${page === 0 ? 1 : 0})`
        }}
      />
      <span>
        Page {page + 1} of {pages}
      </span>
      <img
        src={arrow}
        alt="next"
        onClick={handleNext}
        style={{
          filter: `grayscale(${page + 1 === pages ? 1 : 0})`
        }}
      />
    </div>
  )
}

export const AssetsList: React.FC<{
  search?: string | null
  farmId?: string
  blockchains?: string[]
  filters?: any
  onReward?: any
  onStakingLink?: any
  farmCol?: boolean
}> = ({
  search,
  farmId,
  blockchains,
  filters,
  onReward,
  onStakingLink,
  farmCol = true
}) => {
  const [pages, setPages] = useState(1)
  const [sort, setSort] = useState<{
    value: string
    order: boolean
  }>({
    value: 'tvlStaked',
    order: true
  })
  const [fetchedAssets, setFetchedAssets] = useState<AssetItem[]>()
  const { page, handleBack, handleNext, onChangePage } = usePagination(pages)

  useEffect(() => {
    let temp
    async function fetchAssets() {
      temp = await getAssets(
        page + 1,
        blockchains,
        filters,
        search,
        sort,
        farmId
      )
      setFetchedAssets(temp['data'])
      setPages(temp['max_pages'])
      onReward?.(temp['data']?.[0]?.rewardTokenA)
      onStakingLink?.(temp['data']?.[0]?.stakingLink)
    }
    fetchAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchains, page, filters, sort, search])

  return (
    <StyledPoolsList>
      <Pagination
        page={page}
        pages={pages}
        handleBack={handleBack}
        handleNext={handleNext}
      />
      <PoolsLitItemsContainer>
        <PoolsListItems $lg>
          <TransitionGroup className="pools-list">
            {fetchedAssets
              ? fetchedAssets.map((pool, index) => (
                  <CSSTransition key={index} timeout={500} classNames="pool">
                    <Asset
                      pool={pool}
                      key={index}
                      isRoot={index === 0}
                      sort={sort}
                      setSort={setSort}
                      farmCol={farmCol}
                    />
                  </CSSTransition>
                ))
              : null}
          </TransitionGroup>
        </PoolsListItems>
      </PoolsLitItemsContainer>

      <BottomPagination page={page} count={pages} onChange={onChangePage} />
    </StyledPoolsList>
  )
}

export const FarmsList: React.FC<{
  blockchains?: string[]
  search?: string | null
  filters: Record<string, any>
}> = ({ blockchains, search, filters }) => {
  const [pages, setPages] = useState(1)
  const [sort, setSort] = useState<{
    value: string
    order: boolean
  }>({
    value: 'tvlStaked',
    order: true
  })
  const [fetchedFarms, setFetchedFarms] = useState<FarmItem[]>()
  const { page, handleBack, handleNext, onChangePage } = usePagination(pages)
  const [expanded, setExpanded] = useState<any>(false)

  useEffect(() => {
    let temp
    async function fetchFarms() {
      temp = await getFarms(filters, page + 1, blockchains, search, sort)
      setFetchedFarms(temp['data'])
      setPages(temp['max_pages'])
    }
    setExpanded(false)
    fetchFarms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchains, page, sort, search, filters])

  return (
    <StyledPoolsList>
      <Pagination
        page={page}
        pages={pages}
        handleBack={handleBack}
        handleNext={handleNext}
      />

      <PoolsLitItemsContainer>
        <PoolsListItems>
          <TransitionGroup className="pools-list">
            {fetchedFarms
              ? fetchedFarms.map((farm, index) => {
                  return (
                    <CSSTransition key={index} timeout={500} classNames="pool">
                      <Farm
                        farm={farm}
                        key={farm['farmId']}
                        isRoot={index === 0}
                        sort={sort}
                        setSort={setSort}
                        isActive={expanded === farm['farmId']}
                        setActive={setExpanded}
                      />
                    </CSSTransition>
                  )
                })
              : null}
          </TransitionGroup>
        </PoolsListItems>
      </PoolsLitItemsContainer>

      <BottomPagination page={page} count={pages} onChange={onChangePage} />
    </StyledPoolsList>
  )
}
