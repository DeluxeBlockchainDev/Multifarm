import Grid from '@material-ui/core/Grid'
import MuiSlider from '@material-ui/core/Slider'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { ReactNode, useState } from 'react'

const useStyles = makeStyles({
  root: {
    paddingLeft: '0.75rem',
    paddingRight: '0.75rem'
  },
  sliderRoot: {
    // color: 'rgba(51, 184, 255, 0.25)'
    color: '#33B6FF',
    height: 4
  },
  rail: {
    height: 4
  },
  track: {
    color: '#33B6FF',
    height: 4
  },
  thumb: {
    width: 24,
    height: 24,
    marginTop: -10,
    marginLeft: -12,
    backgroundColor: '#39406A',
    border: '2px solid #33B6FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit'
    }
  },
  mark: {
    width: 1,
    opacity: 1,
    height: 6,
    marginTop: -1
  },
  markActive: {
    opacity: 1,
    backgroundColor: '#fafafa'
  },
  labelContainer: {
    width: 'auto',
    margin: '0 -0.75rem 1.5rem -0.75rem'
  },
  valueLabel: {
    transform: 'none !important',
    fontFamily: 'inherit',
    position: 'static',

    '& > span': {
      transform: 'none',
      borderRadius: 0,
      width: 24,
      height: 24,
      backgroundColor: 'transparent',
      fontSize: '0.625rem',

      '& > span': {
        transform: 'none'
      }
    }
  }
})

interface SliderProps {
  min: number
  max: number
  step: number
  defaultValue?: number
  onChange: (e: number) => void
  labelComponent?: ReactNode
  valueFormat?: (value: number) => any
  renderValueFormat?: (value: number) => string
}

export default function Slider({
  min,
  max,
  step,
  defaultValue,
  onChange,
  labelComponent,
  valueFormat,
  renderValueFormat
}: SliderProps) {
  const classes = useStyles()
  const [innerValue, setInnerValue] = useState(defaultValue as number)

  const handleChange = (e, value) => {
    const newValue: number = valueFormat ? valueFormat(value) : value
    onChange?.(newValue)
  }

  const renderVal = renderValue(innerValue, renderValueFormat, valueFormat)
  return (
    <Grid container direction="column" className={classes.root}>
      {labelComponent && (
        <Grid
          container
          justifyContent="space-between"
          alignContent="center"
          className={classes.labelContainer}
        >
          {labelComponent}

          <span>{renderVal}</span>
        </Grid>
      )}

      <MuiSlider
        min={min}
        max={max}
        step={step}
        marks
        classes={{
          root: classes.sliderRoot,
          rail: classes.rail,
          track: classes.track,
          thumb: classes.thumb,
          mark: classes.mark,
          markActive: classes.markActive,
          valueLabel: classes.valueLabel
        }}
        value={innerValue}
        onChange={(e, value) => setInnerValue(value as number)}
        onChangeCommitted={handleChange}
      />
    </Grid>
  )
}

function renderValue(value, renderValueFormat, valueFormat): string {
  let val = value

  if (valueFormat) {
    val = valueFormat(val)
  }

  if (renderValueFormat) {
    val = renderValueFormat(val)
  }

  return val
}
