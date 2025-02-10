import Toolbar from "@mui/material/Toolbar";
import {Button, Container} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";

interface casualNavbarProps {
    handleRegister:()=>void,
    handleSignIn:()=>void
}
const CasualNavbar =(props:casualNavbarProps) => {
    const { handleRegister, handleSignIn } = props
    const navigate = useNavigate()
    const handleGoHome = () => {
        navigate('/petitions')
    }
    return(
        <Container maxWidth="lg" sx ={{ borderBottom: 1, borderColor: 'divider' }}>
            <React.Fragment>
                <Toolbar sx={{ display:'flex', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider'}}>
                    <div onClick={handleGoHome} style ={{ cursor : 'pointer', marginLeft:'40px' }}>
                        <img src = "../Signed.png" style = {{ height : '100px', width: '200px'}} alt="Petition Site logo"></img>
                    </div>
                    <div>
                        <Button variant="outlined" onClick={handleRegister} sx={{marginRight:'10px', ':hover': { bgcolor: 'primary.main', color:'white'}}}>
                            Register
                        </Button>
                        <Button variant="outlined" onClick={handleSignIn} sx = {{':hover': { bgcolor: 'primary.main', color:'white'}}}>
                            Sign In
                        </Button>
                    </div>
                   
                </Toolbar>
            </React.Fragment>
        </Container>
    )
}

export default CasualNavbar;