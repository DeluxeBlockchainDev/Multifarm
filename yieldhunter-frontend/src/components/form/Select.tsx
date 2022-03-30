import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import { CaretDown } from 'assets/icons'
import classNames from 'classnames'
import Dialog from 'components/dialogs/Dialog'
import DialogBody from 'components/dialogs/DialogBody'
import DialogHead from 'components/dialogs/DialogHead'
import DialogSearch from 'components/dialogs/DialogSearch'
import { useState } from 'react'
import { Option } from 'types/components/form'

import DialogList from '../dialogs/DialogList'
import DialogListItem from '../dialogs/DialogListItem'
import { EmptyPlaceholder } from '../placeholders'

const useStyles = makeStyles({
  root: {},
  input: {
    height: 40,
    borderRadius: 15,
    background: '#474F7E',
    padding: '0 1.25rem',
    cursor: 'pointer'
  },
  value: {
    fontWeight: 700
  }
})

interface SelectProps {
  className?: string
  options: Option[]
  placeholder?: string
  onChange?: (option: Option) => void
  value?: Option | string
}

export default function Select({
  className,
  options,
  placeholder = 'Select',
  value,
  onChange
}: SelectProps) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const valueLabel = value
    ? typeof value === 'string'
      ? options.find((o) => o.value === value)?.label
      : value.label
    : ''

  return (
    <>
      <Grid
        container
        direction="column"
        className={classNames(classes.root, className)}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          className={classes.input}
          onClick={() => setOpen(true)}
        >
          <Typography className={classes.value}>
            {valueLabel || placeholder}
          </Typography>

          <div>
            <CaretDown />
          </div>
        </Grid>
      </Grid>

      <Dialog open={open} height={500}>
        <DialogHead title="Select" onClose={() => setOpen(false)} />
        <DialogSearch onSearch={() => ''} />

        <DialogBody>
          {options.length ? (
            <DialogList>
              {options.map((option, index) => (
                <DialogListItem
                  name={option.label}
                  key={index}
                  onClick={() => {
                    onChange?.(option)
                  }}
                  active={
                    value
                      ? typeof value === 'string'
                        ? option.value === value
                        : option.value === value.value
                      : false
                  }
                />
              ))}
            </DialogList>
          ) : (
            <EmptyPlaceholder />
          )}
        </DialogBody>
      </Dialog>
    </>
  )
}
