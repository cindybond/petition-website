import UserNavbar from "../components/UserNavbar";
import React from "react";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {Card} from "@mui/material";
import useStore from "../store";
import {useNavigate} from "react-router-dom";
import axios from "axios";


const Profile = () =>{
    const user = useStore(state => state.user)
    const userId = user.userId
    const [userDetails, setUserDetails] = React.useState<userReturnWithEmail>({firstName:'', lastName:'', email:''})
    const url = 'http://localhost:4941/api/v1/users/'
    const navigate = useNavigate()
    React.useEffect(() => {
        getDetails()
    }, [])
    console.log(user)
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
                <Card sx={{width: 1000, marginTop: '40px', marginRight: '40px'}}>
                    <div style={{display:'flex', justifyContent:'space-around'}}>
                        <Avatar alt="User Image"
                                src={`http://localhost:4941/api/v1/users/${userId}/image`}
                                sx={{ width: 200, height: 200, margin:'20px' }}></Avatar>
                    </div>
                        <div style={{alignItems: "center"}}>
                            <Typography>First Name:{userDetails.firstName}</Typography>
                            <Typography>Last Name:{userDetails.lastName}</Typography>
                            <Typography>Email:{userDetails.email}</Typography>
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
            <div>
                {showDetails() }
            </div>
        </div>
    )
}

export default Profile