import MuiDialog from '@material-ui/core/Dialog'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { PropsWithChildren } from 'react'
import { device } from 'utils/screen'

const useStyles = makeStyles({
  paper: {
    borderRadius: 15,
    width: '100%',
    maxWidth: 500,
    height: (props: any) => props.height,
    background: '#303659',
    color: '#B2BDFF',
    boxShadow: '0px 8px 60px rgba(34, 39, 64, 0.4)',
    fontFamily: 'Montserrat',
    margin: '1rem',

    [`@media ${device.mobileL}`]: {
      height: '70vh !important'
    }
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)'
  }
})

interface DialogProps {
  open: boolean
  height?: number
}

export default function Dialog({
  children,
  open,
  height
}: PropsWithChildren<DialogProps>) {
  const classes = useStyles({ height })
  return (
    <MuiDialog
      open={open}
      classes={{ paper: classes.paper }}
      BackdropProps={{
        className: classes.backdrop
      }}
    >
      {children}
    </MuiDialog>
  )
}
