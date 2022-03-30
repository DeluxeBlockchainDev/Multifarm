import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import { ReactComponent as CloseIcon } from '../assets/svg/cross.svg'

const useStyles = makeStyles({
  root: {
    height: 40,
    borderRadius: 15,
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(110.29deg, #33B6FF -3.21%, #1A6B9F 105.5%)',
    margin: (props: any) => `${props.spacing}px`
  },
  button: {
    background: 'transparent',
    marginLeft: 5
  }
})

interface FilterChipProps {
  label: string
  onRemove?: any
  spacing?: number
}

export default function FilterChip({
  label,
  onRemove,
  spacing
}: FilterChipProps) {
  const classes = useStyles({ spacing })
  return (
    <Grid item className={classes.root}>
      <span>{label}</span>
      <button className={classes.button} onClick={onRemove}>
        <CloseIcon />
      </button>
    </Grid>
  )
}
