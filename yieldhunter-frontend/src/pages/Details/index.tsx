import './details.scss'

import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import format from 'date-fns/format'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { getAssetDetails } from '../../api/getAssets'
import copy_icon from '../../assets/svg/fi-rr-copy 1.svg'
import { ReactComponent as InfoIcon } from '../../assets/svg/info.svg'
import iconTip from '../../assets/svg/info.svg'
import { AreaChartFarmDetails } from '../../components/charts/LineChart'
import TooltipDropdown from '../../components/TooltipDropdown'
import { nFormatter } from '../../types/utils'
import { parseBoolean, parsePercent } from '../../utils/api'
import { urlDomain } from '../../utils/query'
import { PoolEconomicInfo, PoolEconomicOtherInfo } from './PoolEconomicInfo'

const useStyles = makeStyles({
  tooltip: {
    '& h2': {
      fontSize: 16,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',

      '& svg': {
        marginRight: 15
      },
      '& svg *': {
        fill: '#FFD24D'
      }
    },
    '& p': {
      fontSize: 14,
      '& span': {
        fontWeight: 700
      }
    }
  },
  infoIcon: {
    width: 15,
    margin: '0 10px'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center'
  },
  tooltipText: {
    fontSize: '0.75rem'
  }
})

export default function AssetDetails(): JSX.Element | null {
  const classes = useStyles()
  const { assetId } = useParams<{ assetId: string }>()
  const [fetchedAsset, setFetchedAsset] = useState<any>({})

  useEffect(() => {
    let temp
    async function fetchAssetDetails() {
      temp = await getAssetDetails(assetId)
      setFetchedAsset(temp)
    }
    fetchAssetDetails()
  }, [assetId])

  const handleSetClipboard = (path: string) => {
    navigator.clipboard.writeText(path)
  }

  let date

  if (fetchedAsset.dateUpdated) {
    try {
      date = format(new Date(fetchedAsset.dateUpdated), 'dd/MM/yyyy HH:mm O')
    } catch (e) {
      date = 'n/a'
    }
  } else {
    date = 'n/a'
  }

  const isSingleStake = fetchedAsset.yieldType?.toLowerCase() === 'single-stake'

  return fetchedAsset ? (
    <section className="details-page">
      <h1>
        <Link to={`/farms/${fetchedAsset.farmId}`}>{fetchedAsset.farm}</Link>
        <span>: {fetchedAsset.asset}</span>
      </h1>
      <div className="charts">
        <div>
          <span>Asset APR (y)</span>
          <AreaChartFarmDetails
            percent
            data={fetchedAsset.aprHistory?.slice().reverse() || []}
          />
        </div>
        <div>
          <span>Asset TVL</span>
          <AreaChartFarmDetails
            data={fetchedAsset.tvlStakedHistory?.slice().reverse() || []}
          />
        </div>
      </div>
      <div className="info-table">
        <div className="stepper">
          <h2>Steps</h2>
          <div className="steps">
            <div>
              <span>1</span>
            </div>
            <div>
              <span>2</span>
            </div>
            <div>
              <span>3</span>
            </div>
          </div>
          <div className="steps-text">
            <p>Buy Assets</p>
            <p>Stake Assets on Farm</p>
            <p>Claim Rewards</p>
          </div>
        </div>
        <div className="liquidity">
          <h2>Liquidity</h2>
          <p>
            TVL Exchange{' '}
            <span>
              {fetchedAsset.tvlExchange
                ? '$' + nFormatter(fetchedAsset.tvlExchange)
                : 'n/a'}
            </span>
          </p>
          <p>
            TVL Staked{' '}
            <span>
              {fetchedAsset.tvlStaked
                ? '$' + nFormatter(fetchedAsset.tvlStaked)
                : 'n/a'}{' '}
              <span
                style={{
                  color: fetchedAsset.tvlChange24hValue > 0 ? '#7CFC00' : 'red'
                }}
              >
                ({fetchedAsset.tvlChange24h} - 24h)
              </span>
            </span>
          </p>
        </div>
        <div className="info listing">
          <h2>Info</h2>
          <ul>
            <li>
              <span>Blockchain</span>
              <span>{fetchedAsset.blockchain || 'n/a'}</span>
            </li>
            <li>
              <span>Exchange</span>
              <span>{fetchedAsset.exchangeName || 'n/a'}</span>
            </li>
            <li>
              <span>Farm</span>
              <span>
                {fetchedAsset.farmId ? (
                  <Link to={`/farms/${fetchedAsset.farmId}`}>
                    {fetchedAsset.farmId}
                  </Link>
                ) : (
                  'n/a'
                )}
              </span>
            </li>
            <li>
              <span>Last updated</span>
              <span>{date}</span>
            </li>
            <li>
              <span>Info</span>
              <span>{fetchedAsset.info || 'n/a'}</span>
            </li>
            <li>
              <span>Yield type</span>
              <span>{fetchedAsset.yieldType || 'n/a'}</span>
            </li>
            <li>
              <span>Rewards token</span>
              <span>
                {[fetchedAsset.rewardTokenA, fetchedAsset.rewardTokenB]
                  .filter(Boolean)
                  .join(', ') || 'n/a'}
              </span>
            </li>
            <li>
              <span>Active</span>
              <span>{fetchedAsset.active ? 'yes' : 'no'}</span>
            </li>
          </ul>
        </div>
        <div className="contracts listing">
          <div className="contracts-content-wrapper">
            <div className="contracts-content-container">
              <h2>
                <span>Contracts</span>

                <TooltipDropdown
                  content={
                    <Grid container className={classes.tooltip}>
                      <h2>
                        <InfoIcon />
                        <span>IMPORTANT!</span>
                      </h2>

                      <p>
                        <span>This is for information purposes only,</span>{' '}
                        please do your own research on the contacts, we
                        don&apos;t take any liability for the contracts. Always
                        double check and do your own research.
                      </p>

                      <p>
                        <span>
                          We don&apos;t take accountability for lost funds
                        </span>{' '}
                        and there maybe errors in those smart contracts since we
                        are getting them from third parties.
                      </p>
                    </Grid>
                  }
                  placement="bottom-start"
                >
                  <InfoIcon />
                </TooltipDropdown>
              </h2>

              <ul>
                {!isSingleStake && (
                  <>
                    <li className="wallet">
                      <span>{fetchedAsset.tokenA || 'n/a'}</span>
                      <span></span>
                      <span>{fetchedAsset.tokenAAddress || 'n/a'}</span>
                      <img
                        src={copy_icon}
                        alt="copy"
                        onClick={() =>
                          handleSetClipboard(fetchedAsset.tokenAAddress)
                        }
                      />
                    </li>
                    <li className="wallet">
                      <span>{fetchedAsset.tokenB || 'n/a'}</span>
                      <span></span>
                      <span>{fetchedAsset.tokenBAddress || 'n/a'}</span>
                      <img
                        src={copy_icon}
                        alt="copy"
                        onClick={() =>
                          handleSetClipboard(fetchedAsset.tokenBAddress)
                        }
                      />
                    </li>
                  </>
                )}
                <li className="wallet">
                  <span>{fetchedAsset.asset || 'n/a'}</span>
                  <span></span>
                  <span>{fetchedAsset.assetAddress || 'n/a'}</span>
                  <img
                    src={copy_icon}
                    alt="copy"
                    onClick={() =>
                      handleSetClipboard(fetchedAsset.assetAddress)
                    }
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pool-economics">
          <h2>
            Pool Economics
            <TooltipDropdown content={<PoolEconomicInfo />}>
              <img src={iconTip} alt="icon" className={classes.infoIcon} />
            </TooltipDropdown>
          </h2>
          <p>
            Deposit fee{' '}
            <span>
              {fetchedAsset.depositFee ? `${fetchedAsset.depositFee}%` : 'n/a'}
            </span>
          </p>
          <p>
            Withdrawal fee{' '}
            <span>
              {fetchedAsset.withdrawalFee
                ? `${fetchedAsset.withdrawalFee}%`
                : 'n/a'}
            </span>
          </p>
          <p className={classes.infoRow}>
            Harvest lockup{' '}
            <span>{parseBoolean(fetchedAsset.harvestLockup)}</span>
            <TooltipDropdown
              content={
                <p className={classes.tooltipText}>
                  {fetchedAsset.harvestLockupInfo || 'n/a'}
                </p>
              }
            >
              <img src={iconTip} alt="icon" className={classes.infoIcon} />
            </TooltipDropdown>
          </p>
          <p className={classes.infoRow}>
            Other info
            <TooltipDropdown
              content={
                <PoolEconomicOtherInfo
                  transferTax={fetchedAsset.transferTax}
                  transferTaxInfo={fetchedAsset.transferTaxInfo}
                  antiWhale={fetchedAsset.antiWhale}
                  otherInfo={fetchedAsset.otherPoolEconomicsInfos}
                />
              }
            >
              <img src={iconTip} alt="icon" className={classes.infoIcon} />
            </TooltipDropdown>
          </p>
        </div>
        <div className="apr">
          <h2>APR</h2>
          <p>
            Yearly <span>{parsePercent(fetchedAsset.aprYearly)}</span>
          </p>
          <p>
            Daily <span>{parsePercent(fetchedAsset.aprDaily)}</span>
          </p>
          <p>
            Weekly <span>{parsePercent(fetchedAsset.aprWeekly)}</span>
          </p>
        </div>
        <div className="risc-levels">
          <h2>Risk levels</h2>
          <p style={{ margin: '0 0 0 auto' }}>
            Audit info{' '}
            {fetchedAsset.auditInfo ? (
              <a
                href={fetchedAsset.auditInfo}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#33B6FF' }}
              >
                {urlDomain(fetchedAsset.auditInfo)}
              </a>
            ) : (
              'n/a'
            )}
          </p>
          <p>
            Impermanent Loss{' '}
            {fetchedAsset.impermanentLoss ? (
              <span style={{ color: 'red' }}>
                {fetchedAsset.impermanentLoss || 'n/a'}
              </span>
            ) : (
              'n/a'
            )}
          </p>
        </div>
        <div className="buttons">
          <button>
            <a href={fetchedAsset.investmentLink} target="blank">
              Buy Assets
            </a>
          </button>
          <button>
            <a href={fetchedAsset.stakingLink} target="blank">
              Stake
            </a>
          </button>
        </div>
      </div>
    </section>
  ) : null
}
