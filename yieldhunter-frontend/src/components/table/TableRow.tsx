import makeStyles from '@material-ui/core/styles/makeStyles'
import { PropsWithChildren } from 'react'

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: 60,
    minHeight: 60
  }
})

export default function TableRow({ children }: PropsWithChildren<any>) {
  const classes = useStyles()
  return <tr className={classes.root}>{children}</tr>
}
