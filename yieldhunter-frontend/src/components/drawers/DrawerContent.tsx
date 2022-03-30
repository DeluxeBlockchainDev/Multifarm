import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flex: 1,
    position: 'relative'
  },
  scrollContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'auto'
  },
  content: {
    width: '100%',
    padding: '1.5rem'
  }
})

export default function DrawerContent({ children }) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div className={classes.scrollContainer}>
        <div className={classes.content}>{children}</div>
      </div>
    </div>
  )
}
