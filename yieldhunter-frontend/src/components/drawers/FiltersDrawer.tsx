import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import EditIcon from '@material-ui/icons/Edit'
import Button from 'components/buttons/Button'
import { PropsWithChildren, ReactNode } from 'react'
import { device } from 'utils/screen'

import Drawer from './Drawer'
import DrawerActions from './DrawerActions'
import DrawerHead from './DrawerHead'

export interface FiltersDrawerProps {
  open: boolean
  onClose: () => void
  className?: string
}

export function FiltersDrawer({
  open,
  onClose,
  children,
  className
}: PropsWithChildren<FiltersDrawerProps>) {
  return (
    <Drawer open={open} onClose={onClose} className={className}>
      {children}
    </Drawer>
  )
}

export interface FiltersDrawerHeadProps {
  onClose: () => void
}

export function FiltersDrawerHead({ onClose }: FiltersDrawerHeadProps) {
  return <DrawerHead title="Apply Filters" onClose={onClose} />
}

export interface FiltersDrawerActionsProps {
  onApply: (filters: any) => void
  onReset: () => void
}

export function FiltersDrawerActions({ onReset }) {
  return (
    <DrawerActions>
      <Button variant="semi-transparent" onClick={onReset}>
        Reset
      </Button>
      {/*<Button onClick={onApply}>Apply</Button>*/}
    </DrawerActions>
  )
}

const useSectionStyles = makeStyles({
  paragraph: {
    marginTop: '-1rem',
    marginBottom: '1.5rem',
    fontSize: '0.75rem'
  },
  section: {
    paddingBottom: '2rem',
    marginBottom: '2rem',
    borderBottom: '1px solid #41486E',

    '&:last-child': {
      borderBottom: 0,
      marginBottom: 0
    }
  },
  titleContainer: {
    marginBottom: '1.5rem'
  },
  content: {
    width: 'auto',
    margin: (props: any) => (props.chips ? '-0.5rem' : 0)
  }
})

export interface FiltersDrawerSectionProps {
  title?: string
  subtitle?: string
  chips?: boolean
  slider?: boolean
  titleAction?: ReactNode
}

export function FiltersDrawerSection({
  title,
  subtitle,
  children,
  chips,
  slider,
  titleAction
}: PropsWithChildren<FiltersDrawerSectionProps>) {
  const classes = useSectionStyles({ chips, slider })
  return (
    <div className={classes.section}>
      {title && (
        <Grid
          container
          justifyContent="space-between"
          alignContent="center"
          className={classes.titleContainer}
        >
          <FiltersDrawerTitle>{title}</FiltersDrawerTitle>

          {titleAction}
        </Grid>
      )}
      {subtitle && <h4 className={classes.paragraph}>{subtitle}</h4>}

      <Grid container justifyContent="center" className={classes.content}>
        {children}
      </Grid>
    </div>
  )
}

const useTitleStyles = makeStyles({
  root: {
    fontSize: '1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    [`@media ${device.mobileL}`]: {
      fontSize: '1rem'
    }
  }
})

interface FiltersDrawerTitleProps {
  action?: ReactNode
}

export function FiltersDrawerTitle({
  children,
  action
}: PropsWithChildren<FiltersDrawerTitleProps>) {
  const classes = useTitleStyles()
  return (
    <h3 className={classes.root}>
      {children}
      {action}
    </h3>
  )
}

const useTitleActionStyles = makeStyles({
  root: {
    fontSize: '1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 700,
    cursor: 'pointer',
    userSelect: 'none',

    '& svg': {
      margin: '0 0.5rem',
      fontSize: '1rem'
    },

    [`@media ${device.mobileL}`]: {
      fontSize: '1rem'
    }
  }
})

interface FiltersTitleActionProps {
  onClick: () => void
}

export function FiltersDrawerTitleAction({
  children,
  onClick
}: PropsWithChildren<FiltersTitleActionProps>) {
  const classes = useTitleActionStyles()
  return (
    <p className={classes.root} onClick={onClick}>
      <EditIcon />
      {children}
    </p>
  )
}
