import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import React from 'react'

import { ReactComponent as InfoIcon } from '../assets/svg/info.svg'
import { parseBoolean, parsePercent } from '../utils/api'
import TooltipDropdown from './TooltipDropdown'

const useStyles = makeStyles({
  root: {
    '& > h3': {
      fontSize: 14,
      textTransform: 'uppercase',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      margin: '0 0 20px 0',

      '& svg': {
        marginLeft: 10
      }
    },

    '& > p': {
      fontSize: 12,
      margin: '0 0 10px 0',
      '& span': {
        fontWeight: 700
      }
    }
  }
})

export default function PoolEconomicsTooltip({ children, data }: any) {
  const classes = useStyles()
  return (
    <TooltipDropdown
      content={
        <Grid container direction="column" className={classes.root}>
          <h3>
            <span>Pool Economics</span>
            <InfoIcon />
          </h3>

          <p>
            <span>Deposit fee</span> {parsePercent(data.depositFee)}
          </p>
          <p>
            <span>Withdrawal fee</span> {parsePercent(data.withdrawalFee)}
          </p>
          <p>
            <span>Harvest lockup</span> {parseBoolean(data.harvestLockup)}
          </p>
          <p>
            <span>Transfer tax</span> {parseBoolean(data.transferTax)}
          </p>
          <p>
            <span>Anti whale</span> {parsePercent(data.antiWhale)}
          </p>
        </Grid>
      }
      placement="bottom-end"
    >
      {children}
    </TooltipDropdown>
  )
}
