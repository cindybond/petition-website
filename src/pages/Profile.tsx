import UserNavbar from "../components/UserNavbar";
import React from "react";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
    Alert,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    TextField
} from "@mui/material";
import useStore from "../store";
import axios from "axios";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";


const Profile = () =>{
    const user = useStore(state => state.user)
    const userId = user.userId
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const [selectedImage, setSelectedImage] = React.useState<File |null>(null);
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const [errorOpen, setErrorOpen] = React.useState(false)
    const [snackError, setSnackError] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [userDetails, setUserDetails] = React.useState<userReturnWithEmail>({firstName:'', lastName:'', email:''})
    const url = 'http://localhost:4941/api/v1/users/'

    React.useEffect(() => {
        const getDetails = () => {
            axios.get(url + userId, {headers: {'X-Authorization': user.token}})
                .then((response) => {
                    setUserDetails(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getDetails()
    }, [user.token, userId])

    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
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
    const handleChange = (e:any) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value
        });
    }

    const handleEditDialogOpen =()=> {
        setOpenEditDialog(true)
    }
    const handleEditDialogClose =()=> {
        setOpenEditDialog(false)
        window.location.reload()
    }

    const handleEditSubmit = () => {
        uploadImage()
        patchUser()
    }

    const patchUser = () => {
        axios.patch(url + userId, userDetails,{headers: {'X-Authorization': user.token}})
            .then((response) => {
                setSnackMessage("Details Successfully Edited")
                setSnackOpen(true)
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }, (error) => {
                setSnackError(error.response.statusText.toString())
                setErrorOpen(true)
            })
    }

    const uploadImage = () => {
        if(selectedImage!== null) {
            axios.put(url + `${userId}/image`, selectedImage ,{headers: {'Content-Type':selectedImage?.type, 'X-Authorization': user.token}})
                .then((response) => {
                    setSnackMessage("Details Successfully Edited")
                    setSnackOpen(true)
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }, (error) => {
                    setSnackError(error.response.statusText.toString())
                    setErrorOpen(true)
                })
        }}
    const showDetails = () => {
        return(
            <Container sx={{display: 'flex', justifyContent: 'space-around'}}>
                <Card sx={{marginTop: '40px', padding:'30px'}}>
                    <div style={{display:'flex', justifyContent:'space-around'}}>
                        <Avatar alt="User Image"
                                src={`http://localhost:4941/api/v1/users/${userId}/image`}
                                sx={{ width: 200, height: 200, margin:'20px' }}></Avatar>
                    </div>
                        <div style={{alignItems: "center"}}>
                            <Typography variant="subtitle1">First Name: {userDetails.firstName}</Typography>
                            <Typography variant="subtitle1">Last Name: {userDetails.lastName}</Typography>
                            <Typography variant="subtitle1">Email: {userDetails.email}</Typography>
                        </div>
                    <div>
                        {/*Edit Profile Dialog*/}
                        <Dialog
                            open={openEditDialog}
                            onClose={handleEditDialogClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="aler-dialog-title">
                                {"Edit Details"}
                            </DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={handleEditDialogClose}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <DialogContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={7}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="firstName"
                                            label="First Name"
                                            name="firstName"
                                            value={userDetails.firstName}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={7}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="lastName"
                                            label="Last Name"
                                            name="lastName"
                                            value={userDetails.lastName}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={7}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            value={userDetails.email}
                                            autoComplete="email"
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={5} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography>Upload Petition Image</Typography>
                                        <input type="file" id="myFile" name="filename" accept="image/*" onChange={handleImageChange} />
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
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleEditDialogClose}>Cancel</Button>
                                <Button variant="contained" color="primary" type="submit" onClick={handleEditSubmit} autoFocus>
                                    SAVE
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Card>
            </Container>
        )
    }
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
            <Container maxWidth="lg">
                <div>
                    <UserNavbar />
                </div>
                <div style={{display:'flex', justifyContent:'center', marginTop:'20px'}}>
                    <Button color= "secondary" variant="outlined" size='large' onClick={handleEditDialogOpen}
                            startIcon={<ModeEditOutlineIcon/>}>EDIT PROFILE</Button>
                </div>
                <div>
                    {showDetails() }
                </div>
                   
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    autoHideDuration={3000}
                    open={snackOpen}
                    onClose={handleSnackClose}
                    key={snackMessage}
                >
                    <Alert onClose={handleSnackClose} severity="success" sx={{
                        width:'100%'
                    }}>
                        {snackMessage}
                    </Alert>
                </Snackbar>
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
            </Container>
        )
}}

export default Profile;