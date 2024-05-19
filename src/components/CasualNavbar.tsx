import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import React from "react";

interface casualNavbarProps {
    handleRegister:()=>void,
    handleSignIn:()=>void
}
const CasualNavbar =(props:casualNavbarProps) => {
    const { handleRegister, handleSignIn } = props
    return(
        <div>
            <React.Fragment>
                <Toolbar sx={{ display:'flex', borderBottom: 1, borderColor: 'divider'}}>
                    <Link href="#" underline="none" color="inherit" sx={{flex:1}}>
                        <Typography variant="h4" align="left">PETITION SITE</Typography>
                    </Link>

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