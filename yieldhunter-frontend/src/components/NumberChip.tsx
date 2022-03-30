import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useState } from 'react'

import { ReactComponent as CaretDown } from '../assets/svg/caret-down.svg'
import { decrease, increase } from '../utils/filters'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 30px',
    height: 40,
    background: 'linear-gradient(107.39deg, #474F7E 3.48%, #343B61 97.52%)',
    color: '#fff',
    borderRadius: 15,
    fontSize: '1rem',
    fontWeight: 700,
    margin: (props: any) => `${props.spacing}px`,

    '@media(max-width: 1024px)': {
      width: '100%'
    }
  },
  arrows: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,

    '& button': {
      padding: 5,
      height: 15,
      display: 'flex',
      background: 'transparent',
      outline: 'unset'
    },

    '& button:first-child': {
      transform: 'rotate(180deg) translateX(0.5px)'
    }
  }
})

interface NumberChipProps {
  label: string
  value: number
  prefix?: string
  onChange?: any
  spacing?: number
  valueFormatter?: any
  increaseHandler?: any
  decreaseHandler?: any
}

export default function NumberChip({
  label,
  value,
  prefix = '',
  valueFormatter,
  onChange,
  spacing,
  increaseHandler,
  decreaseHandler
}: NumberChipProps) {
  const classes = useStyles({ spacing })
  const [inner, setInner] = useState(value)

  // eslint-disable-next-line
  const debouncedCallback = useCallback(
    debounce((val) => {
      onChange?.(val)
    }, 500),
    []
  )

  useEffect(() => {
    if (value !== inner) {
      setInner(value)
    }
    // eslint-disable-next-line
  }, [value])

  useEffect(() => {
    debouncedCallback(inner)
    // eslint-disable-next-line
  }, [inner])

  const handleIncrease = () => {
    setInner(increaseHandler || increase)
  }

  const handleDecrease = () => {
    setInner(decreaseHandler || decrease)
  }

  return (
    <Grid className={classes.root}>
      <span>
        {label +
          ' ' +
          (valueFormatter ? valueFormatter(inner) : inner) +
          prefix}
      </span>
      <span className={classes.arrows}>
        <button onClick={handleIncrease}>
          <CaretDown />
        </button>
        <button onClick={handleDecrease}>
          <CaretDown />
        </button>
      </span>
    </Grid>
  )
}
