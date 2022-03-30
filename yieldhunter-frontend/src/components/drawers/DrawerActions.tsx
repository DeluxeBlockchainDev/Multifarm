import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles({
  root: {
    padding: '1.5rem',
    display: 'grid',
    // gridTemplateColumns: '1fr 1fr',
    gridTemplateColumns: '1fr',
    gap: '1.5rem'
  }
})

export default function DrawerActions({ children }) {
  const classes = useStyles()
  return (
    <Grid container className={classes.root}>
      {children}
    </Grid>
  )
}
