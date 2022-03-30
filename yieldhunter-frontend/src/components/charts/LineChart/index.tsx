import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts'

import { nFormatter } from '../../../types/utils'

export const LineChartFarms = ({ data = [] }: { data?: any[] }) => {
  const convertDate = (timestamp) => {
    const date = String(timestamp).split('.')
    return `${date[1]}.${date[2]}`
  }
  const convertValue = (value) => nFormatter(value)

  const renderColorfulLegendText = (value: string) => {
    return <span style={{ color: 'white' }}>{value}</span>
  }

  return (
    <div style={{ height: '255px' }}>
      {data && data.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 10
            }}
          >
            <XAxis
              dataKey="date"
              tickFormatter={convertDate}
              fontSize="0.625rem"
              color="#B2BDFF"
              tickMargin={10}
              tick={{
                fill: '#fff'
              }}
            />
            <YAxis
              padding={{ top: 20, bottom: 20 }}
              fontSize="12px"
              domain={['auto', 'auto']}
              tickFormatter={convertValue}
              label={{ formatter: renderColorfulLegendText }}
              tick={{
                fill: '#fff'
              }}
            />
            <CartesianGrid stroke="#6B6BB2" />
            <Line
              type="monotoneX"
              unit="M"
              dataKey="value"
              strokeLinecap="round"
              strokeWidth={2}
              lightingColor="#000"
              stroke="#46BDFF"
              dot={false}
              legendType="none"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  )
}

export const AreaChartFarmDetails = ({
  percent,
  data
}: {
  data?: any[]
  percent?: boolean
}) => {
  const convertDate = (timestamp) => {
    const date = String(timestamp).split('.')
    return `${date[1]}.${date[2]}`
  }

  const convertValue = (value) =>
    (percent ? '' : '$') + nFormatter(value) + (percent ? '%' : '')

  const renderColorfulLegendText = (value: string) => {
    return <span style={{ color: 'white' }}>{value}</span>
  }

  const longestLabelLength =
    data
      ?.map((c) => convertValue(c.value))
      .reduce((acc, cur) => (cur.length > acc ? cur.length : acc), 0) || 6

  return (
    <div style={{ height: '255px' }}>
      {data && data.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 10
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DC4DFF" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#4DBFFF" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={convertDate}
              fontSize="0.625rem"
              tickMargin={10}
              tick={{
                fill: '#fff'
              }}
            />
            <YAxis
              padding={{ top: 0, bottom: 0 }}
              fontSize="14px"
              domain={['auto', 'auto']}
              tickFormatter={convertValue}
              label={{ formatter: renderColorfulLegendText }}
              tick={{
                fill: '#fff'
              }}
              width={longestLabelLength * 10}
            />
            <CartesianGrid stroke="#6B6BB2" />
            <Area
              type="monotoneX"
              unit="M"
              dataKey="value"
              strokeLinecap="round"
              strokeWidth={2}
              lightingColor="#000"
              stroke="#DC4DFF"
              fillOpacity={1}
              fill="url(#colorUv)"
              dot={false}
              legendType="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  )
}
