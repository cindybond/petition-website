import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Petitions from "./Petitions";
import Link from '@mui/material/Link';
import {Card, CardActionArea, CardContent, CardMedia, InputBase, Paper} from '@mui/material';
import CSS from 'csstype';
import Grid from "@mui/material/Grid";
import {useNavigate} from "react-router-dom";
    const card: CSS.Properties = {
        padding:'10px',
        margin:'60px',
    }


const Home: React.FC = () => {

    const navigate = useNavigate()

    const handleRegister = () => {
        navigate('/register')
    }

    const handleSignIn = () => {
        navigate('/login')
    }
    return (
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

          <div>
                <Petitions />
          </div>

      </div>

  );
}

export default Home;
