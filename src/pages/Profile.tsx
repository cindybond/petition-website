import UserNavbar from "../components/UserNavbar";
import React from "react";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import useStore from "../store";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import Grid from "@mui/material/Grid";


const Profile = () =>{
    const user = useStore(state => state.user)
    const userId = user.userId
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const [userData, setUserData] = React.useState< Array< userRegister>>([])
    const [selectedImage, setSelectedImage] = React.useState<File |null>(null);
    const [userDetails, setUserDetails] = React.useState<userReturnWithEmail>({firstName:'', lastName:'', email:''})
    const url = 'http://localhost:4941/api/v1/users/'
    const navigate = useNavigate()
    React.useEffect(() => {
        getDetails()
    }, [])
    console.log(user)
    const handleImageChange = (e:any) => {
        setSelectedImage(e.target.files[0])
    }
    const handleChange = (e:any) => {
        const data = {...userData}
        data[e.target.name] = e.target.value
        setUserData(data)
    }
    const handleEditDialogOpen =()=> {
        setOpenEditDialog(true)
    }
    const handleEditDialogClose =()=> {
        setOpenEditDialog(false)
    }
    const getDetails = () => {
        axios.get(url + userId, {headers: {'X-Authorization': user.token}})
            .then((response) => {
                setUserDetails(response.data)
                console.log(response.data)
        })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }



    const showDetails = () => {
        return(
            <Container sx={{display: 'flex', justifyContent: 'space-around'}}>
                <Card sx={{marginTop: '40px', marginRight: '40px', padding:'30px'}}>
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
                        {/*Support Dialog*/}
                        <Dialog
                            open={openEditDialog}
                            onClose={handleEditDialogClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="aler-dialog-title">
                                {"Edit Details"}
                            </DialogTitle>
                            <DialogContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={7}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="firstName"
                                            label="First Name"
                                            name="firstName"
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
                                <Button variant="contained" color="primary" autoFocus>
                                    SAVE
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Card>
            </Container>
        )
    }

    return (
        <div>
            <div>
                <UserNavbar />
            </div>
            <div style={{display:'flex', justifyContent:'center', margin:'20px'}}>
                <Button color= "secondary" variant="outlined" size='large' onClick={handleEditDialogOpen}
                        startIcon={<ModeEditOutlineIcon/>}>EDIT PROFILE</Button>
            </div>
                {showDetails() }
        </div>
    )
}

export default Profile