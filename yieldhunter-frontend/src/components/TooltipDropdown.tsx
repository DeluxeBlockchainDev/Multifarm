import { makeStyles, Tooltip } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(107.39deg, #474F7E 3.48%, #343B61 97.52%)',
    borderRadius: 15,
    boxShadow: '0px 4px 15px rgba(20, 6, 75, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    padding: '20px 40px'
  }
})

export default function TooltipDropdown({
  children,
  content,
  className,
  ...props
}: any) {
  const classes = useStyles()
  return (
    <Tooltip
      title={content}
      classes={{ tooltip: classNames(classes.root, className) }}
      enterTouchDelay={0}
      {...props}
    >
      {children}
    </Tooltip>
  )
}
