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

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
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
  const [userData, setUserData] = React.useState< Array< userRegister>>([])
  const [selectedImage, setSelectedImage] = React.useState<File |null>(null);
  const setUser = useStore(state => state.setUser)
  const url = 'http://localhost:4941/api/v1'

  const navigate = useNavigate()
  const handleChange = (e:any) => {
    const data = {...userData}
    data[e.target.name] = e.target.value
    setUserData(data)
  }

  const handleUploadPhoto = () => {
    console.log('Uploading photo')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postRegister()
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
          setErrorFlag(true)
          setErrorMessage(error.toString())
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
          setErrorFlag(true)
          setErrorMessage(error.toString())
        })
  };
  const uploadImage = (userId:number, token:string) => {
      if(selectedImage!== null) {
          axios.put(url + `/users/${userId}/image`, selectedImage ,{headers: {'Content-Type':selectedImage?.type, 'X-Authorization': token}})
              .then((response) => {
                  console.log('image uploaded')
              }, (error) => {
                  setErrorFlag(true)
                  setErrorMessage(error.toString())
              })
      }
      }

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
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={handleChange}
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
              <Grid item xs={12}>
                <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary"/>}
                    label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
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
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}