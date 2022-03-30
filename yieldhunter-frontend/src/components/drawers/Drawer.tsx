import MuiDrawer from '@material-ui/core/Drawer'
import makeStyles from '@material-ui/core/styles/makeStyles'
import classNames from 'classnames'
import { PropsWithChildren } from 'react'

import useMediaQueries from '../../hooks/useMediaQueries'

const useStyles = makeStyles({
  paper: {
    width: (props: any) => (props.isMobile ? '100%' : 500),
    height: (props: any) => (props.isMobile ? '75vh' : '100vh'),
    background: 'linear-gradient(111.6deg, #303659 -2.51%, #292E4D 104.46%)',
    color: '#B2BDFF',
    boxShadow: '0px 8px 60px rgba(34, 39, 64, 0.4)',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: (props: any) =>
      props.isMobile ? '25px 25px 0 0' : '25px 0 0 25px',
    border: '1px solid #41486E',
    fontFamily: 'Montserrat',

    '& *': {
      boxSizing: 'border-box'
    }
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)'
  }
})

interface DrawerProps {
  open: boolean
  onClose: () => void
  className?: string
}

export default function Drawer({
  open,
  children,
  onClose,
  className
}: PropsWithChildren<DrawerProps>) {
  const { isMobile } = useMediaQueries()
  const classes = useStyles({ isMobile })
  return (
    <MuiDrawer
      anchor={isMobile ? 'bottom' : 'right'}
      open={open}
      onClose={onClose}
      classes={{ paper: classNames(classes.paper, className) }}
      BackdropProps={{
        className: classes.backdrop
      }}
    >
      {children}
    </MuiDrawer>
  )
}
