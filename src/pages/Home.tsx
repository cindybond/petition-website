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
    const card: CSS.Properties = {
        padding:'10px',
        margin:'60px',
    }

const Home: React.FC = () => {
  return (
      <div>
          <React.Fragment>
              <Toolbar sx={{ display:'flex', borderBottom: 1, borderColor: 'divider'}}>
                  <Link href="#" underline="none" color="inherit" sx={{flex:1}}>
                      <Typography variant="h4" align="left">PETITION SITE</Typography>
                  </Link>

                  <Button variant="outlined" href="http://localhost:8080/register" sx={{margin:'10px'}}>
                      Register
                  </Button>
                  <Button variant="outlined" href="http://localhost:8080/login">
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
