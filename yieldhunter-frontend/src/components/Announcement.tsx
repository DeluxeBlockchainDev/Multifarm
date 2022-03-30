import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CloseIcon from '@material-ui/icons/Close'
import parse from 'html-react-parser'
import React, { useEffect, useState } from 'react'

import useAnnouncement from '../hooks/useAnnouncement'
import LocalStorage from '../utils/LocalStorage'
import { device } from '../utils/screen'

const useStyles = makeStyles({
  banner: {
    padding: '1rem 2rem',
    background: 'linear-gradient(111.6deg, #303659 -2.51%, #292E4D 104.46%)',
    borderRadius: '1rem',
    marginBottom: '2rem',
    color: '#fff'
  },
  bannerText: {
    fontSize: '1rem',

    '& a': {
      color: '#33B6FF',
      textDecoration: 'none',
      fontWeight: 700
    },

    '@media(max-width: 1024px)': {
      fontSize: '0.95rem'
    }
  },
  bannerContent: {
    flex: 1
  },
  button: {
    cursor: 'pointer',
    marginLeft: '1rem'
  }
})

export default function Announcement() {
  const classes = useStyles()
  const isMobile = useMediaQuery(device.mobileL)
  const { announcement } = useAnnouncement()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (LocalStorage.get('announcement') === announcement.updatedOn) {
      setHidden(true)
    }
  }, [announcement.updatedOn])

  if (!announcement.announcement || isMobile || hidden) {
    return null
  }

  const handleClose = () => {
    setHidden(true)
    LocalStorage.set('announcement', announcement.updatedOn)
  }

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      className={classes.banner}
    >
      <Grid className={classes.bannerContent}>
        <Typography component="div" className={classes.bannerText}>
          {parse(announcement.announcement)}
        </Typography>
      </Grid>
      <CloseIcon className={classes.button} onClick={handleClose} />
    </Grid>
  )
}
