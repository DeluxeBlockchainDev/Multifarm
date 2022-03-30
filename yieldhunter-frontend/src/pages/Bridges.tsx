import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import Select from 'components/form/Select'
import Table from 'components/table/Table'
import TableCell from 'components/table/TableCell'
import TableRow from 'components/table/TableRow'
import { Link } from 'components/typography'
import useBridges from 'hooks/useBridges'
import useBridgesCombination from 'hooks/useBridgesCombination'
import { useState } from 'react'
import { Option } from 'types/components/form'
import { TableCol } from 'types/components/table'

import {
  EmptyPlaceholder,
  LoadingPlaceholder
} from '../components/placeholders'
import { parsePercent } from '../utils/api'

const useStyles = makeStyles((theme) => {
  return {
    control: {
      width: '100%',
      maxWidth: 200,
      marginRight: '1.25rem',

      [theme.breakpoints.down('xs')]: {
        maxWidth: '100%',
        marginBottom: '1.25rem',
        marginRight: '0',

        '&:last-child': {
          marginBottom: '0'
        }
      }
    },
    controlsContainer: {
      marginBottom: '2.5rem'
    },
    title: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#FAFAFA',
      marginBottom: '1.25rem'
    },
    tableContainer: {
      maxWidth: 700
    }
  }
})

const COLS: TableCol[] = [
  { title: 'Name', minWidth: 200 },
  { title: 'Comment' },
  { title: 'Fee', align: 'right' }
]

export default function Bridges() {
  const classes = useStyles()
  const { bridges } = useBridges()

  const [values, setValues] = useState<Record<string, any>>({})

  const bridgeValues = Object.values(values)

  const { combinations, isLoading } = useBridgesCombination({
    bridge: bridgeValues
  })

  const handleChange = (name: string, option: Option) => {
    setValues((values) => {
      if (Object.values(values).includes(option.value)) {
        const copy = { ...values }
        delete copy[name]
        return copy
      }
      return {
        ...values,
        [name]: option.value
      }
    })
  }

  return (
    <Grid container direction="column">
      <Grid container className={classes.controlsContainer}>
        {bridges.map((bridge, index) => (
          <Select
            key={index}
            className={classes.control}
            options={bridge.blockchains.map((b) => ({ value: b, label: b }))}
            placeholder={bridge.bridgeName}
            value={values[bridge.bridgeName]}
            onChange={(option) => handleChange(bridge.bridgeName, option)}
          />
        ))}
      </Grid>

      <Typography className={classes.title}>Available Bridges</Typography>

      <Grid container className={classes.tableContainer}>
        {isLoading && bridgeValues.length ? (
          <LoadingPlaceholder />
        ) : !combinations.length ? (
          <EmptyPlaceholder />
        ) : (
          <Table cols={COLS}>
            {combinations.map((combination, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Link to="/">{combination.bridgeName}</Link>
                </TableCell>
                <TableCell>{combination.comment || 'n/a'}</TableCell>
                <TableCell align="right">
                  {parsePercent(combination.fee, 0)}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Grid>
    </Grid>
  )
}
