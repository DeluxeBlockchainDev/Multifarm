import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem 0'
  }
})

export function LoadingPlaceholder() {
  const classes = useStyles()
  return <div className={classes.root}>Loading...</div>
}

export function EmptyPlaceholder() {
  const classes = useStyles()
  return <div className={classes.root}>No Data</div>
}
