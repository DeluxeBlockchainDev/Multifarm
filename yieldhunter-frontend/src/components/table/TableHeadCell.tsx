import makeStyles from '@material-ui/core/styles/makeStyles'
import { PropsWithChildren } from 'react'
import { TableCol } from 'types/components/table'

const useStyles = makeStyles({
  root: {
    padding: '0.5rem 0.5rem',
    minWidth: (props: any) => props.minWidth || undefined,

    '&:first-child': {
      paddingLeft: '2.5rem'
    },
    '&:last-child': {
      paddingRight: '2.5rem'
    }
  }
})

type TableHeadCellProps = Pick<TableCol, 'align' | 'minWidth'>

export default function TableHeadCell({
  children,
  align = 'left',
  minWidth
}: PropsWithChildren<TableHeadCellProps>) {
  const classes = useStyles({ minWidth })
  return (
    <th align={align} className={classes.root}>
      {children}
    </th>
  )
}
