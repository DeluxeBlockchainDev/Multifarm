import makeStyles from '@material-ui/core/styles/makeStyles'
import { PropsWithChildren } from 'react'
import { TableCol } from 'types/components/table'

const useStyles = makeStyles({
  root: {
    backgroundColor: '#303659',
    padding: '0.5rem 0.5rem',
    fontSize: '1rem',
    minWidth: (props: any) => props.minWidth || undefined,

    '&:first-child': {
      borderTopLeftRadius: '1rem',
      borderBottomLeftRadius: '1rem',
      paddingLeft: '2.5rem'
    },
    '&:last-child': {
      borderTopRightRadius: '1rem',
      borderBottomRightRadius: '1rem',
      paddingRight: '2.5rem'
    }
  }
})

type TableCellProps = Pick<TableCol, 'align' | 'minWidth'>

export default function TableCell({
  children,
  align = 'left',
  minWidth
}: PropsWithChildren<TableCellProps>) {
  const classes = useStyles({ minWidth })
  return (
    <td className={classes.root} align={align}>
      {children}
    </td>
  )
}
