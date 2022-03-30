import makeStyles from '@material-ui/core/styles/makeStyles'
import classNames from 'classnames'
import { Link as RouterLink, LinkProps } from 'react-router-dom'

const useLinkStyles = makeStyles({
  root: {
    color: '#66C8FF',
    fontWeight: 700,
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline'
    }
  }
})

export function Link(props: LinkProps) {
  const classes = useLinkStyles()
  return (
    <RouterLink
      className={classNames(classes.root, props.className)}
      {...props}
    />
  )
}
