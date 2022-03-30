import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import classNames from 'classnames'
import { ChangeEvent, ReactNode } from 'react'

const useStyles = makeStyles({
  inputContainer: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    width: '100%',
    outline: 'none',
    border: 'none',
    height: 40,
    fontSize: '1rem',
    padding: (props: any) =>
      props.prefix ? '0 1.25rem 0 3.5rem' : '0 1.25rem',
    backgroundColor: '#303659',
    borderRadius: 15,
    color: '#fafafa',
    fontFamily: 'Montserrat'
  },
  prefix: {
    position: 'absolute',
    left: '1.25rem',
    height: 18,
    width: 18,

    '& svg': {
      width: 18,
      height: 18
    }
  }
})

export interface InputProps {
  type?: string
  prefix?: ReactNode
  placeholder?: string
  className?: string
  inputClassName?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function Input({
  type = 'text',
  prefix,
  placeholder,
  className,
  inputClassName,
  onChange
}: InputProps) {
  const classes = useStyles({ prefix: !!prefix })
  return (
    <Grid container direction="column" className={className}>
      <div className={classes.inputContainer}>
        {!!prefix && <span className={classes.prefix}>{prefix}</span>}
        <input
          type={type}
          placeholder={placeholder}
          className={classNames(classes.input, inputClassName)}
          onChange={onChange}
        />
      </div>
    </Grid>
  )
}
