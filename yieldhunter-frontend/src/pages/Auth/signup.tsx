import React, { useEffect, useState } from 'react'
import { Button, TextField, Grid, Typography } from "@material-ui/core";
import styles from './auth.module.scss'

export default function Signup(): JSX.Element | null {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authflag, setAutoflag] = useState(false);

  const handleSubmit = (e) => {
    return;
  }

  return (
    <Grid container justifyContent="center" className={styles.form_wrapper} direction="column">
      <Typography variant="h5">SIGN UP</Typography>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6">Email Address</Typography>
        <TextField
          type="email"
          placeholder="Your Email"
          fullWidth
          name="email"
          variant="outlined"
          value={email}
          onChange={(event) => setEmail(event.target.value)
          }
          required
          autoFocus
        />
        <Typography variant="h6">Full Name</Typography>
        <TextField
          type="text"
          placeholder="Your Full Name"
          fullWidth
          name="username"
          variant="outlined"
          value={username}
          onChange={(event) => setUsername(event.target.value)
          }
          required
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
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Grid>
  );
}