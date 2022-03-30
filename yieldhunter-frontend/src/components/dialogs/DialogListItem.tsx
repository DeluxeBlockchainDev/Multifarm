import makeStyles from '@material-ui/core/styles/makeStyles'
import CheckIcon from '@material-ui/icons/Check'

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #41486E',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    '&:first-child': {
      borderTop: '1px solid #41486E'
    },

    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.1)'
    },

    '& svg': {
      width: 18,
      height: 18
    }
  },
  name: {
    fontSize: '0.875rem',

    '& .search-highlight': {
      color: '#FFD700'
    }
  }
})

interface DialogListItemProps {
  active?: boolean
  name: string
  onClick?: () => void
}

export default function DialogListItem({
  name,
  active,
  onClick
}: DialogListItemProps) {
  const classes = useStyles()
  return (
    <li className={classes.root} onClick={onClick}>
      <p className={classes.name} dangerouslySetInnerHTML={{ __html: name }} />

      {active && <CheckIcon />}
    </li>
  )
}
