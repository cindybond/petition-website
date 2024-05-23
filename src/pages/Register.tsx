import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import useStore from "../store";
import {useState} from "react";
import {Alert, InputAdornment, Snackbar} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";

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

export default function Register() {
  const [errorFlag, setErrorFlag] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
    const [errorOpen, setErrorOpen] = React.useState(false)
    const [snackError, setSnackError] = React.useState("")
  const [userData, setUserData] = React.useState< Array< userRegister>>([])
  const [selectedImage, setSelectedImage] = React.useState<File |null>(null);
  const setUser = useStore(state => state.setUser)
  const url = 'http://localhost:4941/api/v1'
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

  const navigate = useNavigate()
  const handleChange = (e:any) => {
    const data = {...userData}
    data[e.target.name] = e.target.value
    setUserData(data)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postRegister()
  };
    const handleErrorClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
    };


    const handleImageChange = (e:any) => {
      setSelectedImage(e.target.files[0])
  }

  const postRegister = () => {
    axios.post(`http://localhost:4941/api/v1/users/register`, userData)
        .then((response) => {
          setErrorFlag(false)
          setErrorMessage("")
          postLogin()
          setUser(response.data)
        }, (error) => {
            setSnackError(error.response.statusText.toString())
            setErrorOpen(true)
        })
  }

  const postLogin = () => {
    axios.post('http://localhost:4941/api/v1/users/login', userData)
        .then((response) => {
          setErrorFlag(false)
          setErrorMessage("")
          setUser(response.data)
          const userId = response.data.userId
          const token = response.data.token
            console.log(selectedImage)
            uploadImage(userId, token)
          navigate('/')
        }, (error) => {
            setSnackError(error.response.statusText.toString())
            setErrorOpen(true)
        })
  };
  const uploadImage = (userId:number, token:string) => {
      if(selectedImage!== null) {
          axios.put(url + `/users/${userId}/image`, selectedImage ,{headers: {'Content-Type':selectedImage?.type, 'X-Authorization': token}})
              .then((response) => {
                  console.log('image uploaded')
              }, (error) => {
                  setSnackError(error.response.statusText.toString())
                  setErrorOpen(true)
              })
      }}

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
            Register
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    onChange={handleChange}
                    autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <div style={{alignItems:'center', margin:'40px'}}>
                {selectedImage && (
                    <div>
                      <img
                          alt="not found"
                          width={"250px"}
                          src={URL.createObjectURL(selectedImage)}
                      />
                      <br /> <br />
                      <button onClick={() => setSelectedImage(null)}>Remove</button>
                    </div>
                )}

                <Typography>Upload Profile Photo</Typography>
                  <input type="file" id="myFile"
                         name="filename" accept="image/*" onChange={handleImageChange}
                  />
              </div>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
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
}