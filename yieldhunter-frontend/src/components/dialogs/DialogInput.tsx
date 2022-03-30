import makeStyles from '@material-ui/core/styles/makeStyles'
import Input, { InputProps } from 'components/form/Input'

const useStyles = makeStyles({
  root: {
    backgroundColor: '#272D49',
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem'
  }
})

export default function DialogInput(props: InputProps) {
  const classes = useStyles()
  return <Input {...props} inputClassName={classes.root} />
}
