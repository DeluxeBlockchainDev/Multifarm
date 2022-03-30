import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import { usePagination } from '@material-ui/lab/Pagination'
import classNames from 'classnames'
import { useState } from 'react'

import { ReactComponent as ArrowRight } from '../assets/svg/arrow-right.svg'

const useStyles = makeStyles({
  root: {
    paddingTop: 40,
    color: '#B2BDFF'
  },
  button: {
    padding: 7,
    margin: 7,
    display: 'flex',
    background: 'transparent',
    color: '#B2BDFF',

    '&:hover': {
      color: '#66C8FF'
    },

    '&:disabled': {
      filter: 'grayscale(1)'
    }
  },
  btnPrev: {
    '& svg': {
      transform: 'rotate(180deg)'
    }
  },
  active: {
    color: '#fff',
    fontWeight: 700
  },
  container: {
    display: 'flex',
    alignItems: 'center',

    '@media(max-width: 1024px)': {
      marginBottom: 10
    }
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    marginLeft: 20
  },
  input: {
    width: 44,
    height: 40,
    borderRadius: 10,
    background: 'transparent',
    border: '1px solid #B2BDFF',
    outline: 'none',
    margin: '0 16px',
    color: '#fff',
    padding: '0 10px'
  },
  goBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'transparent',
    color: '#66C8FF',
    fontWeight: 700,

    '& svg': {
      marginLeft: 5
    }
  }
})

export default function BottomPagination({ page, count, onChange }: any) {
  const currentPage = page + 1
  const classes = useStyles()
  const [manualPage, setManualPage] = useState('')
  const { items } = usePagination({ count, page: currentPage })

  const handleGo = () => {
    manualPage &&
      !isNaN(+manualPage) &&
      !(+manualPage > count) &&
      !(+manualPage <= 0) &&
      onChange(+manualPage - 1)
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className={classes.root}
    >
      <Grid className={classes.container}>
        {items.map(({ page, type, selected, ...item }, index) => {
          if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            return <span key={index}>...</span>
          }
          if (type === 'page') {
            return (
              <button
                className={classNames(classes.button, {
                  [classes.active]: selected
                })}
                key={index}
                type="button"
                onClick={() => onChange(page - 1)}
              >
                {page}
              </button>
            )
          }
          if (type === 'next') {
            return (
              <button
                key={index}
                className={classes.button}
                disabled={currentPage === count}
                onClick={() => onChange(currentPage)}
              >
                <ArrowRight />
              </button>
            )
          }
          if (type === 'previous') {
            return (
              <button
                key={index}
                className={classNames(classes.btnPrev, classes.button)}
                disabled={currentPage === 1}
                onClick={() => onChange(currentPage - 2)}
              >
                <ArrowRight />
              </button>
            )
          }
          return (
            <button key={index} type="button" {...item}>
              {type}
            </button>
          )
        })}
      </Grid>

      <Grid className={classes.inputContainer}>
        <span>Go to page</span>

        <input
          type="text"
          className={classes.input}
          value={manualPage}
          onChange={(e) => setManualPage(e.target.value)}
        />

        <button className={classes.goBtn} onClick={handleGo}>
          <span>Go</span>
          <ArrowRight />
        </button>
      </Grid>
    </Grid>
  )
}
