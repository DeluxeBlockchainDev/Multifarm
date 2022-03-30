import React, { useEffect, useState } from 'react'
import { Button, TextField, Grid, Typography, Link } from "@material-ui/core";
import styles from './auth.module.scss'

export default function Login(): JSX.Element | null {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errormsg, setErrormsg] = useState('');
  //const [authflag, setAutoflag] = useState(false);

  const handleValidation = () => {
    let errorMsg = '';
    let formIsValid = true;

    //Password
    if (!password) {
      formIsValid = false;
      errorMsg = "Please check your email and password and try again";
    }

    //Email
    if (!username) {
      formIsValid = false;
      errorMsg = "Please check your email and password and try again";
    }

    let lastAtPos = username.lastIndexOf("@");
    let lastDotPos = username.lastIndexOf(".");

    if (
      !(
        lastAtPos < lastDotPos &&
        lastAtPos > 0 &&
        username.indexOf("@@") == -1 &&
        lastDotPos > 2 &&
        username.length - lastDotPos > 2
      )
    ) {
      formIsValid = false;
      errorMsg = "Please check your email and password and try again";
    }

    setErrormsg(errorMsg);
    return formIsValid;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleValidation();
  }

  return (
    <Grid container justifyContent="center" className={styles.form_wrapper} direction="column">
      <Typography variant="h5">SIGN IN&nbsp;&nbsp;(Alpha users only)</Typography>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6">Email Address</Typography>
        <TextField
          type="email"
          placeholder="Your Email"
          fullWidth
          name="username"
          variant="outlined"
          value={username}
          onChange={(event) => setUsername(event.target.value) }
          className={errormsg?styles.form_error:''}
          autoFocus
        />
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
          className={errormsg?styles.form_error:''}
        />
        <span className={styles.errormsg}>{errormsg}</span>
        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          Submit
        </Button>
        <Link href="/reset" variant="body2">
          Forgot Password?
        </Link>
      </form>
    </Grid>
  );
}