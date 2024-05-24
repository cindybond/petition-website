import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import useStore from "../store";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Alert, InputAdornment, Snackbar} from "@mui/material";
import IconButton from "@mui/material/IconButton";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Cindy Bond
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {

  const [errorFlag, setErrorFlag] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
    const [errorOpen, setErrorOpen] = React.useState(false)
    const [snackError, setSnackError] = React.useState("")
  const [userData, setUserData] = React.useState<Array<userLogin>>([])
  const navigate = useNavigate()
  const setUser = useStore(state => state.setUser)
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
  const handleChange = (e:any) => {
    const data = {...userData}
    data[e.target.name] = e.target.value
    setUserData(data)
  }
    const handleErrorClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
    };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postLogin()
  };

  const postLogin = () => {
    axios.post('http://localhost:4941/api/v1/users/login', userData)
        .then((response) => {
          setErrorFlag(false)
          setErrorMessage("")
            setUser(response.data)
          navigate('/')
        }, (error) => {
            setSnackError(error.response.statusText.toString())
            setErrorOpen(true)
        })
  };

    if (errorFlag) {
        return (
            <div>
                <h1>Error</h1>
                <div style={{color: "red"}}>
                    {errorMessage}
                </div>
            </div>
        )
    } else {

      return (
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleChange}
                />
                  <TextField
                      margin="normal"
                      type={showPassword ? 'text' : 'password'}
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      id="password"
                      autoComplete="current-password"
                      onChange={handleChange}
                      InputProps={{
                          endAdornment: (
                              <InputAdornment position="end">
                                  <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                  >
                                      {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                              </InputAdornment>
                          )
                      }}
                  />

                  <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                  </Grid>
                  <Grid item>
                    <Link href="register" variant="body2" >
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Container>
            {/*Error Snackbar*/}
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                autoHideDuration={3000}
                open={errorOpen}
                onClose={handleErrorClose}
                key={snackError}
            >
                <Alert onClose={handleErrorClose} severity="error" sx={{
                    width:'100%'
                }}>
                    {snackError}
                </Alert>
            </Snackbar>
        </ThemeProvider>
      );
    }}