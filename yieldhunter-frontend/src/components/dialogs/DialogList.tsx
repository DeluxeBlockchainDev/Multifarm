import makeStyles from '@material-ui/core/styles/makeStyles'
import { PropsWithChildren } from 'react'

const useStyles = makeStyles({
  root: {
    width: 'auto',
    margin: '0 -1.5rem'
  }
})

export default function DialogList({ children }: PropsWithChildren<any>) {
  const classes = useStyles()
  return <ul className={classes.root}>{children}</ul>
}
