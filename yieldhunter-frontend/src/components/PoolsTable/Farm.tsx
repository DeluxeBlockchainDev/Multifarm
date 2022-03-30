import { Tooltip } from '@material-ui/core'
import format from 'date-fns/format'
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { getAssetsByFarmId } from '../../api/getAssets'
import arrow from '../../assets/svg/arrow-right.svg'
import { ReactComponent as InfoIcon } from '../../assets/svg/info.svg'
import {
  AssetItem,
  createMarkup,
  FarmItem,
  nFormatter
} from '../../types/utils'
import { DATE_FORMAT_PRIMARY } from '../../utils/date'
import PoolEconomicsTooltip from '../PoolEconomicsTooltip'
import {
  RootSpan,
  SortArrow,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledAccordionSummaryWrapper,
  SummaryProvider
} from './styled'

const AssetInfo = styled(InfoIcon)`
  min-width: 16px;
`

const AssetInFarm = styled.div<any>`
  display: flex;
  flex-direction: row;
  width: -moz-available;
  width: -webkit-fill-available;
  height: 40px;
  justify-content: space-between;
  padding: 0.7rem 20px;
  border-radius: 15px;
  font-size: 0.85rem;
  line-height: 20px;

  min-width: ${(props) => (props.width ? props.width + 'px' : 'unset')};

  &:nth-child(odd) {
    background: linear-gradient(111.6deg, #39406a -2.51%, #343a60 104.46%);
  }
  & span {
    flex-direction: column-reverse;
    width: inherit;
    white-space: nowrap;

    &:last-child {
      width: auto;
    }
  }
  & a {
    white-space: nowrap;
  }
  & a:not(.asset-name) {
    color: #66c8ff;
    font-weight: bold;
  }
  & a.asset-name {
    color: #fff;
  }
`

const ShowMore = styled.button`
  height: 1.5rem;
  width: max-content;
  margin-left: 1rem;
  background-color: inherit;
  font-weight: bold;
  font-size: 0.875rem;
  line-height: 1rem;
  display: flex;
  align-items: center;
  color: #e166ff;
  margin-top: 0.5rem;
`

const FarmLink = styled(Link)`
  width: unset !important;
  white-space: nowrap;
  color: #66c8ff;
  font-size: 0.9rem;
  font-weight: bold;
`

const AssetsHeadCell = styled.span<any>`
  font-weight: 700;
  min-width: ${(props) => props.width}px;
  padding: 0 5px;

  @media (max-width: 1024px) {
    min-width: unset;
  }
`

const AssetBodyCell = styled.span<any>`
  min-width: ${(props) => props.width}px;
  padding: 0 5px;

  @media (max-width: 1024px) {
    min-width: unset;
  }
`

export const Farm: React.FC<{
  farm: FarmItem
  isRoot: boolean
  sort: {
    value: string
    order: boolean
  }
  setSort: React.Dispatch<
    React.SetStateAction<{
      value: string
      order: boolean
    }>
  >
  isActive?: boolean
  setActive?: any
}> = ({ farm, isRoot, sort, setSort, isActive, setActive }) => {
  const history = useHistory()
  const [assetsSort, setAssetsSort] = useState('tvlStaked')
  const [assetOrder, setAssetOrder] = useState(true)

  const {
    farmId,
    farmName,
    tvlStaked,
    blockchain,
    dateAdded,
    tvlChange24hValue,
    colorizedHtml
  } = farm

  const date = new Date(dateAdded)

  const [assets, setAssets] = useState<AssetItem[]>()

  useEffect(() => {
    if (!isActive) return

    let temp
    async function fetchFarms() {
      temp = await getAssetsByFarmId(farmId, assetOrder, assetsSort)
      setAssets(temp['data'])
    }
    fetchFarms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, assetOrder, assetsSort])

  const LabledSort = ({ value, label }: { value: string; label: string }) => {
    const isNewSort = value !== sort.value
    return (
      <span
        className="label-span"
        style={{
          color: `${sort.value === value ? '#66C8FF' : 'currentColor'}`
        }}
        onClick={(e) => {
          e.stopPropagation()
          setActive(false)
          setSort({
            value: value,
            order: isNewSort ? true : !sort.order
          })
        }}
      >
        {label}
        <SortArrow
          src={arrow}
          alt="sort"
          sortValue={sort.value}
          sortOrder={sort.order}
          value={value}
        />
      </span>
    )
  }

  const AssetSortLabel = ({ value, label, ...props }: any) => {
    const isNewSort = value !== assetsSort
    return (
      <AssetsHeadCell
        style={{
          color: `${assetsSort === value ? '#66C8FF' : 'currentColor'}`,
          cursor: 'pointer'
        }}
        onClick={(e) => {
          e.stopPropagation()
          setAssetsSort(value)
          setAssetOrder(isNewSort ? true : !assetOrder)
        }}
        {...props}
      >
        {label}
        <SortArrow
          src={arrow}
          alt="sort"
          sortValue={assetsSort}
          sortOrder={assetOrder}
          value={value}
        />
      </AssetsHeadCell>
    )
  }

  const formatDate = format(new Date(date), DATE_FORMAT_PRIMARY)
  return (
    <StyledAccordion
      $isRoot={isRoot}
      expanded={isActive}
      onChange={(e, expanded) => setActive(expanded ? farmId : false)}
    >
      <StyledAccordionSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <StyledAccordionSummaryWrapper id={'Farms'}>
          {isRoot ? (
            <>
              <RootSpan>
                {colorizedHtml ? (
                  <div dangerouslySetInnerHTML={createMarkup(colorizedHtml)} />
                ) : (
                  farmName
                )}
                <LabledSort value="farmName" label="Farm" />
              </RootSpan>
              <RootSpan>
                {blockchain}
                <LabledSort value="blockchain" label="Blockchain" />
              </RootSpan>
              <RootSpan>
                $ {nFormatter(tvlStaked)}
                <LabledSort value="tvlStaked" label="TVL" />
              </RootSpan>
              <RootSpan>
                {tvlChange24hValue.toFixed(2) + ' %'}
                <LabledSort value="tvlChange24hValue" label="Change (24h)" />
              </RootSpan>
              <RootSpan>
                {formatDate}
                <LabledSort value="dateAdded" label="Date Added" />
              </RootSpan>

              <FarmLink to={`/farms/${farmId}`}>Farm page</FarmLink>
            </>
          ) : (
            <>
              <SummaryProvider>
                {colorizedHtml ? (
                  <div dangerouslySetInnerHTML={createMarkup(colorizedHtml)} />
                ) : (
                  farmName
                )}
              </SummaryProvider>
              <span>{blockchain}</span>
              <span>$ {nFormatter(tvlStaked)}</span>
              <span>{tvlChange24hValue.toFixed(2) + ' %'}</span>
              <span>{formatDate}</span>

              <FarmLink to={`/farms/${farmId}`}>Farm page</FarmLink>
            </>
          )}
        </StyledAccordionSummaryWrapper>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <>
          {assets ? (
            <>
              <AssetInFarm>
                <AssetsHeadCell width={150}>Asset</AssetsHeadCell>
                <AssetSortLabel label="TVL" value="tvlStaked" width={100} />
                <AssetSortLabel label="APR(y)" value="aprYearly" width={100} />
                <AssetsHeadCell width={75}>Farm</AssetsHeadCell>
                <AssetsHeadCell width={75}>Rewards</AssetsHeadCell>
                <AssetsHeadCell width={100} />
                <AssetsHeadCell width={100} />
                <AssetsHeadCell width={20} />
              </AssetInFarm>
              {assets.slice(0, 10).map((asset) => {
                const { rewardTokenA, rewardTokenB, aprYearly } = asset
                const aprY = `${
                  aprYearly > 10000 ? '>10,000.00' : aprYearly.toFixed(2)
                } %`
                return (
                  <AssetInFarm key={asset.assetId + asset.tvlStaked}>
                    <AssetBodyCell className="ign" width={150}>
                      <Link
                        to={`/assets/${asset.assetId}`}
                        className="asset-name"
                      >
                        {asset.asset}
                      </Link>
                    </AssetBodyCell>
                    <AssetBodyCell width={100}>
                      $ {nFormatter(asset.tvlStaked)}
                    </AssetBodyCell>
                    <AssetBodyCell width={100}>
                      <Tooltip title={`${aprYearly} %`}>
                        <span>{aprY}</span>
                      </Tooltip>
                    </AssetBodyCell>
                    <AssetBodyCell width={75}>{asset.farm}</AssetBodyCell>
                    <AssetBodyCell width={75}>
                      {rewardTokenA} {rewardTokenB}
                    </AssetBodyCell>
                    <AssetBodyCell width={100}>
                      <a href={asset.investmentLink} target="blank">
                        Buy Assets
                      </a>
                    </AssetBodyCell>
                    <AssetBodyCell width={100}>
                      <a href={asset.stakingLink} target="blank">
                        Stake
                      </a>
                    </AssetBodyCell>

                    <AssetBodyCell>
                      <PoolEconomicsTooltip data={asset}>
                        <Link to={`/assets/${asset.assetId}`}>
                          <AssetInfo />
                        </Link>
                      </PoolEconomicsTooltip>
                    </AssetBodyCell>
                  </AssetInFarm>
                )
              })}
            </>
          ) : (
            <h5>Loading...</h5>
          )}
          <ShowMore onClick={() => history.push(`farms/${farm.farmId}`)}>
            More
          </ShowMore>
        </>
      </StyledAccordionDetails>
    </StyledAccordion>
  )
}
