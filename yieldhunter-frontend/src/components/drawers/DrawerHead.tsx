import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { CloseIcon } from 'assets/icons'

import useMediaQueries from '../../hooks/useMediaQueries'

const useStyles = makeStyles({
  root: {
    padding: '1.5rem',
    fontFamily: 'Montserrat',
    position: 'relative'
  },
  title: {
    width: '100%',
    fontSize: (props: any) => (props.isMobile ? '1rem' : '1.5rem'),
    textAlign: (props: any) => (props.isMobile ? 'center' : 'left')
  },
  btn: {
    position: 'absolute',
    right: '1.5rem',
    background: 'transparent',
    color: 'inherit',

    '&:hover': {
      color: '#FAFAFA'
    }
  }
})

export default function DrawerHead({ title, onClose }) {
  const { isMobile } = useMediaQueries()
  const classes = useStyles({ isMobile })
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      className={classes.root}
    >
      <h2 className={classes.title}>{title}</h2>

      <button onClick={onClose} className={classes.btn}>
        <CloseIcon />
      </button>
    </Grid>
  )
}
