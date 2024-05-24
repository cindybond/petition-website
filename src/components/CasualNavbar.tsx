import Toolbar from "@mui/material/Toolbar";
import {Button} from "@mui/material";
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
        <div>
            <React.Fragment>
                <Toolbar sx={{ display:'flex', borderBottom: 1, borderColor: 'divider'}}>
                    <Button sx={{marginLeft:'40px', marginRight:'auto', fontSize:'40px'}} onClick={handleGoHome}>PETITION SITE</Button>
                    <Button variant="outlined" onClick={handleRegister} sx={{margin:'10px'}}>
                        Register
                    </Button>
                    <Button variant="outlined" onClick={handleSignIn}>
                        Sign In
                    </Button>
                </Toolbar>
            </React.Fragment>
        </div>
    )
}

export default CasualNavbar;