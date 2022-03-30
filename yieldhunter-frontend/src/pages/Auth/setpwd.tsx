import React, { useEffect, useState } from 'react'
import { Button, TextField, Grid, Typography, Link } from "@material-ui/core";
import styles from './auth.module.scss'

export default function SetPwd(): JSX.Element | null {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [authflag, setAutoflag] = useState(false);

  const handleSubmit = (e) => {
    return;
  }

  return (
    <Grid container justifyContent="center" className={styles.form_wrapper} direction="column">
      <Typography variant="h5">CREATE NEW PASSWORD</Typography>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6">Your new password must be different from previous used passwords.</Typography>
        <Typography variant="h6">Password</Typography>
        <TextField
          type="password"
          placeholder="Your Password"
          fullWidth
          name="password"
          variant="outlined"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
        />
        <Typography variant="h6">Confirm Password</Typography>
        <TextField
          type="password"
          placeholder="Your Password Again"
          fullWidth
          name="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          Reset Password
        </Button>
      </form>
    </Grid>
  );
}