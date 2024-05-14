import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { InputBase, Paper } from '@mui/material';


const Home: React.FC = () => {
  return (
    <React.Fragment>
      <Toolbar sx={{ display:'flex', borderBottom: 1, borderColor: 'divider'}}>
        <Link href="#" underline="none" color="inherit" sx={{flex:1}}>
            <Typography variant="h5" align="left">PETITION SITE</Typography>
        </Link>
        <Button href="http://localhost:8080/petitions">Browse</Button>
        <Paper 
            component="form"
            sx={{height:'40px', margin:'10px'}}>
            <InputBase
                placeholder="Search for petition"
                sx={{flex:1, padding:'5px'}}></InputBase>
            <IconButton>
                <SearchIcon />
            </IconButton>
        </Paper>
        <Button variant="outlined" href="http://localhost:8080/register" sx={{margin:'10px'}}>
          Register
        </Button>
        <Button variant="outlined" href="http://localhost:8080/login">
          Sign In
        </Button>
      </Toolbar>
    </React.Fragment>
  );
}

export default Home;
