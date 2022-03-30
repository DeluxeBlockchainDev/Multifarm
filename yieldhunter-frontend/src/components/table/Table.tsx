import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { PropsWithChildren } from 'react'
import { TableCol } from 'types/components/table'

import TableHeadCell from './TableHeadCell'

const useStyles = makeStyles({
  root: {
    borderCollapse: 'separate',
    borderSpacing: '0 1.25rem',
    padding: '-1.25rem 0'
  }
})

interface TableProps {
  cols: TableCol[]
}

export default function Table({
  children,
  cols
}: PropsWithChildren<TableProps>) {
  const classes = useStyles()
  return (
    <Grid container direction="column">
      <table className={classes.root}>
        <thead>
          <tr>
            {cols.map((row, index) => (
              <TableHeadCell
                key={index}
                align={row.align}
                minWidth={row.minWidth}
              >
                {row.title}
              </TableHeadCell>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </Grid>
  )
}
