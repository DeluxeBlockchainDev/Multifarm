import makeStyles from '@material-ui/core/styles/makeStyles'
import { CloseIcon } from 'assets/icons'
import classNames from 'classnames'
import Button from 'components/buttons/Button'
import { PropsWithChildren } from 'react'
import { device } from 'utils/screen'

const useStyles = makeStyles({
  root: {
    margin: '0.5rem',
    minHeight: 40,
    height: 'fit-content',
    border: '1px solid transparent',
    display: 'flex',
    alignItems: 'center',
    padding: '0.25rem 1rem',

    '&:hover': {
      borderColor: '#33B6FF'
    },

    [`@media ${device.mobileL}`]: {
      minHeight: 35,
      fontSize: '1rem'
    }
  },
  active: {
    color: '#fafafa',
    backgroundColor: '#33B6FF'
  },
  removeBtn: {
    padding: '0.5rem',
    color: 'inherit',
    height: 25,
    width: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
    margin: '0 -0.75rem 0 0.5rem',
    background: 'transparent',

    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },

    '& svg': {
      width: 10,
      height: 10
    }
  }
})

interface ChipProps {
  active?: boolean
  onClick?: any
  onRemove?: () => any
}

export default function Chip({
  children,
  active,
  onClick,
  onRemove
}: PropsWithChildren<ChipProps>) {
  const classes = useStyles()

  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove?.()
  }

  return (
    <Button
      variant="semi-transparent"
      className={classNames(classes.root, {
        [classes.active]: active
      })}
      onClick={onClick}
    >
      {children}

      {!!onRemove && (
        <span className={classes.removeBtn} onClick={handleRemove}>
          <CloseIcon />
        </span>
      )}
    </Button>
  )
}
