import { Tooltip, Typography } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router-dom'

import arrow from '../../assets/svg/arrow-right.svg'
import iconTip from '../../assets/svg/info.svg'
import { AssetItem, createMarkup, nFormatter } from '../../types/utils'
import PoolEconomicsTooltip from '../PoolEconomicsTooltip'
import TooltipDropdown from '../TooltipDropdown'
import {
  RootSpan,
  RowSpan,
  SortArrow,
  StyledAccordion,
  StyledAccordionSummary,
  StyledAccordionSummaryWrapper,
  StyledButton
} from './styled'

export const Asset: React.FC<{
  pool: AssetItem
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
  farmCol?: boolean
}> = ({ pool, isRoot, sort, setSort, farmCol = true }) => {
  const history = useHistory()

  const { assetId } = pool

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

  let aprD, aprY, aprDFixed, aprYFixed

  if (typeof pool.aprDaily === 'number') {
    aprDFixed = pool.aprDaily.toFixed(2) || ''
    aprD = `${pool.aprDaily > 10000 ? '>10,000.00' : aprDFixed} %`
  } else {
    aprDFixed = pool.aprDaily
    aprD = pool.aprDaily
  }

  if (typeof pool.aprYearly === 'number') {
    aprYFixed = pool.aprYearly?.toFixed(2) || ''
    aprY = `${pool.aprYearly > 10000 ? '>10,000.00' : aprYFixed} %`
  } else {
    aprYFixed = pool.aprYearly
    aprY = pool.aprYearly
  }

  const assetName =
    (pool.asset || '').length > 13
      ? `${pool.asset.substr(0, 13)}...`
      : pool.asset

  const infoIcon = (
    <img
      src={iconTip}
      alt="i"
      onTouchStart={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    />
  )

  return (
    <StyledAccordion
      $isRoot={isRoot}
      onClick={() => history.push(`/assets/${assetId}`)}
    >
      <StyledAccordionSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <StyledAccordionSummaryWrapper id={`Assets`}>
          {isRoot ? (
            <>
              <RootSpan width={130}>
                {pool.colorizedHtml ? (
                  <div
                    dangerouslySetInnerHTML={createMarkup(pool.colorizedHtml)}
                  />
                ) : (
                  <Tooltip title={pool.asset}>
                    <span style={{ whiteSpace: 'nowrap' }}>
                      {assetName || 'n/a'}
                    </span>
                  </Tooltip>
                )}
                <LabledSort value="asset" label="Asset" />
              </RootSpan>
              <RootSpan width={90}>
                $ {nFormatter(pool.tvlStaked)}{' '}
                <LabledSort value="tvlStaked" label="TVL" />
              </RootSpan>
              <RootSpan>
                <Tooltip title={`${aprYFixed} %`}>
                  <span>{aprY || 'n/a'}</span>
                </Tooltip>
                <LabledSort value="aprYearly" label="APR (y)" />
              </RootSpan>
              <RootSpan>
                <Tooltip title={`${aprDFixed} %`}>
                  <span>{aprD}</span>
                </Tooltip>
                <LabledSort value="aprYearly" label="APR (d)" />
              </RootSpan>
              <RootSpan width={75}>
                {pool.blockchain}
                <LabledSort value="blockchain" label="Blockchain" />
              </RootSpan>
              {farmCol && (
                <RootSpan width={75}>
                  {pool.farm}
                  <LabledSort value="farm" label="Farm" />
                </RootSpan>
              )}
              <RootSpan>
                {pool.rewardTokenA} {pool.rewardTokenB}{' '}
                <LabledSort value="rewardTokenA" label="Rewards" />
              </RootSpan>
            </>
          ) : (
            <>
              <RowSpan width={130}>
                {pool.colorizedHtml ? (
                  <div
                    dangerouslySetInnerHTML={createMarkup(pool.colorizedHtml)}
                  />
                ) : (
                  <Tooltip title={pool.asset}>
                    <span style={{ whiteSpace: 'nowrap' }}>
                      {assetName || 'n/a'}
                    </span>
                  </Tooltip>
                )}
              </RowSpan>
              <RowSpan width={90}>$ {nFormatter(pool.tvlStaked)}</RowSpan>

              <RowSpan>
                <Tooltip title={`${aprYFixed} %`}>
                  <span>{aprY || 'n/a'}</span>
                </Tooltip>
              </RowSpan>
              <RowSpan>
                <Tooltip title={`${aprDFixed} %`}>
                  <span>{aprD}</span>
                </Tooltip>
              </RowSpan>

              <RowSpan width={75}>{pool.blockchain}</RowSpan>

              {farmCol && <RowSpan width={75}>{pool.farm}</RowSpan>}

              <RowSpan>
                {pool.rewardTokenA || 'n/a'} {pool.rewardTokenB}
              </RowSpan>
            </>
          )}
          <span className={'activities'}>
            <TooltipDropdown
              disableHoverListener={!!pool.investmentLink}
              content={<Typography>Coming soon</Typography>}
            >
              <StyledButton
                href={pool.investmentLink}
                target="blank"
                onClick={(e) => e.stopPropagation()}
                disabled={!pool.investmentLink}
              >
                Buy Assets
              </StyledButton>
            </TooltipDropdown>
            <StyledButton
              href={pool.stakingLink}
              target="blank"
              onClick={(e) => e.stopPropagation()}
            >
              Stake
            </StyledButton>

            <PoolEconomicsTooltip data={pool}>{infoIcon}</PoolEconomicsTooltip>
          </span>
        </StyledAccordionSummaryWrapper>
      </StyledAccordionSummary>
    </StyledAccordion>
  )
}
