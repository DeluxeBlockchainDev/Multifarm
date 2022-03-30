import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Chip from 'components/chips/Chip'
import { RENDER_VALUE, TITLES, TITLES_SECONDARY } from 'utils/filters'
import { device } from 'utils/screen'

const useStyles = makeStyles({
  root: {
    padding: '1.5rem 0',

    [`@media ${device.mobileL}`]: {
      justifyContent: 'center'
    }
  }
})

interface ActiveFiltersProps {
  filters: Record<string, any>
  clearFilter: (key: string) => void
  titlesVariant?: 'primary' | 'secondary'
  onClick?: () => void
}

export default function ActiveFilters({
  filters,
  clearFilter,
  titlesVariant = 'primary',
  onClick
}: ActiveFiltersProps) {
  const classes = useStyles()

  const activeFilters = Object.keys(filters).filter((key) =>
    Array.isArray(filters[key]) ? filters[key].length : !!filters[key]
  )

  if (!activeFilters.length) {
    return null
  }

  const titles = titlesVariant === 'primary' ? TITLES : TITLES_SECONDARY

  return (
    <Grid container wrap="wrap" className={classes.root}>
      {activeFilters.map((row) => (
        <Chip key={row} onRemove={() => clearFilter(row)} onClick={onClick}>
          {titles[row]}:{' '}
          {RENDER_VALUE[row] ? RENDER_VALUE[row](filters[row]) : filters[row]}
        </Chip>
      ))}
    </Grid>
  )
}
