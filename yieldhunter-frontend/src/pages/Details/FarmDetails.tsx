import './details.scss'

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getFarmDetails } from '../../api/getFarms'
import go_to_link from '../../assets/go_to_link.png'
import { AreaChartFarmDetails } from '../../components/charts/LineChart'
import { FarmItem, nFormatter } from '../../types/utils'
import { AssetsList } from '..'

export default function FarmDetails(): JSX.Element | null {
  const { farmId } = useParams<{ farmId: string }>()
  const [fetchedData, setFetchedData] = useState<FarmItem>()
  const [chartData, setChartData] = useState<any[]>()
  const [reward, setReward] = useState('')
  const [stakingLink, setStakingLink] = useState('')

  useEffect(() => {
    let temp: FarmItem
    async function fetchFarmDetails() {
      temp = await getFarmDetails(farmId)
      setFetchedData(temp)
      setChartData(temp.tvlStakedHistory.reverse())
    }
    fetchFarmDetails()
  }, [farmId])

  return fetchedData ? (
    <section className="details-page">
      <h1>{fetchedData.farmName}</h1>
      <div className="charts farm-chart">
        <div className="chart">
          <div className="info-row">
            <span>
              <strong>TVL Staked Farm</strong>: $
              {nFormatter(fetchedData.tvlStaked)} ({fetchedData.tvlChange24h})
            </span>
            <span>
              <strong>Blockchain</strong>: {fetchedData.blockchain}
            </span>
            <span>
              <strong>Native Token</strong>: {reward || 'n/a'}
            </span>
            <span>
              <strong>Market Cap</strong>: n/a
            </span>
            <span className="link-span">
              <img src={go_to_link} alt="" />
              <strong>
                <a href={stakingLink} target="blank">
                  {fetchedData.farmId}
                </a>
              </strong>
            </span>
          </div>
          <AreaChartFarmDetails data={chartData} />
        </div>
      </div>
      <AssetsList
        filters={{}}
        farmId={farmId}
        onReward={setReward}
        onStakingLink={setStakingLink}
        farmCol={false}
      />
    </section>
  ) : null
}
