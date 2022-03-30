import React, { useEffect, useState } from 'react'
import { Button, TextField, Grid, Typography, Link } from "@material-ui/core";
import styles from './auth.module.scss'

export default function Reset(): JSX.Element | null {
  const [username, setUsername] = useState('');
  const [errormsg, setErrormsg] = useState('');

  const handleValidation = () => {
    let errorMsg = '';
    let formIsValid = true;

     //Email
    if (!username) {
      formIsValid = false;
      errorMsg = "Please input your email address.";
    } else {

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
        errorMsg = "The email address is invalid.";
      }
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
      <Typography variant="h5">RESET THE PASSWORD</Typography>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6">Enter the email address associated with your account and we’ll send an email with instructions to reset your password.</Typography>
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
        <span className={styles.errormsg}>{errormsg}</span>
        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          Send Instructions
        </Button>
      </form>
    </Grid>
  );
}