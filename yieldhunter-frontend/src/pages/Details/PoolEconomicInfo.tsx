import makeStyles from '@material-ui/core/styles/makeStyles'

import { parseBoolean, parsePercent } from '../../utils/api'

const useStyles = makeStyles({
  root: {
    fontSize: '0.875rem',
    '& span': {
      fontWeight: 700
    }
  }
})

export function PoolEconomicInfo() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <p>
        <span>Deposit Fee</span>: Fee paid when depositing/staking the assets.
      </p>
      <p>
        <span>Withdrawal Fee</span>: Fee paid when withdrawing the assets.
      </p>
      <p>
        <span>Harvest Lockup</span>: The harvest lockup locks users&apos;
        farming rewards for xx hours/days and xx % of the rewards.
      </p>
      <p>
        <span>Transfer Tax</span>: Each transfer of the native token must pay a
        xx% transfer tax.
      </p>
      <p>
        <span>Anti Whale</span>: Any transfer of more than xx % of the total
        supply of the native token will be rejected.
      </p>
    </div>
  )
}

const usePoolEconomicOtherInfoStyles = makeStyles({
  root: {
    fontSize: '0.875rem',
    '& span': {
      fontWeight: 700
    }
  },
  row: {
    margin: '0.5rem'
  }
})

export function PoolEconomicOtherInfo({
  transferTax,
  transferTaxInfo,
  antiWhale,
  otherInfo
}) {
  const classes = usePoolEconomicOtherInfoStyles()
  return (
    <div className={classes.root}>
      <p className={classes.row}>
        <span>Transfer Tax</span>: {parseBoolean(transferTax)}
      </p>
      <p className={classes.row}>
        <span>Transfer Tax Info</span>: {transferTaxInfo || 'n/a'}
      </p>
      <p className={classes.row}>
        <span>Anti Whale</span>: {parsePercent(antiWhale)}
      </p>
      <p className={classes.row}>
        <span>Other Info</span>: {otherInfo || 'n/a'}
      </p>
    </div>
  )
}
