import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles({
  root: {
    paddingTop: '2rem',
    width: '100%'
  }
})

export default function Spacing() {
  const classes = useStyles()
  return <div className={classes.root} />
}
