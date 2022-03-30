import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { SearchIcon } from 'assets/icons'

import DialogInput from './DialogInput'

const useStyles = makeStyles({
  root: {
    padding: '0 1.5rem 1rem 1.5rem'
  }
})

interface DialogSearchProps {
  onSearch: any
}

export default function DialogSearch({ onSearch }: DialogSearchProps) {
  const classes = useStyles()
  return (
    <Grid container className={classes.root}>
      <DialogInput
        placeholder="Search"
        prefix={<SearchIcon />}
        onChange={onSearch}
      />
    </Grid>
  )
}
