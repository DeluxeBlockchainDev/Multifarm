import makeStyles from '@material-ui/core/styles/makeStyles'
import classNames from 'classnames'
import { PropsWithChildren } from 'react'

const COLORS = {
  contained: {
    primary: '#33B6FF',
    secondary: '#D733FF'
  },
  'semi-transparent': {
    primary: 'rgba(51, 184, 255, 0.25)',
    secondary: 'rgba(214, 51, 255, 0.25)'
  }
}

const TEXT_COLORS = {
  contained: {
    primary: '#fafafa',
    secondary: '#fafafa'
  },
  'semi-transparent': {
    primary: '#33B6FF',
    secondary: '#D733FF'
  }
}

const useStyles = makeStyles({
  root: {
    height: 50,
    borderRadius: 25,
    fontSize: '1rem',
    fontFamily: 'Montserrat',
    fontWeight: 700,
    padding: '0 1.5rem',
    backgroundColor: (props: any) => COLORS[props.variant][props.color],
    color: (props: any) => TEXT_COLORS[props.variant][props.color],
    transition: 'all 0.25s'
  }
})

interface ButtonProps {
  color?: 'primary' | 'secondary'
  variant?: 'contained' | 'semi-transparent'
  className?: string
  onClick?: any
}

export default function Button({
  children,
  color = 'primary',
  variant = 'contained',
  className,
  onClick
}: PropsWithChildren<ButtonProps>) {
  const classes = useStyles({ color, variant })
  return (
    <button className={classNames(classes.root, className)} onClick={onClick}>
      {children}
    </button>
  )
}
