import Toolbar from "@mui/material/Toolbar";
import {
    Button,
    Container,
    Menu,
    MenuItem,
    Tooltip
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import React from "react";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import useStore from "../store";

const UserNavbar = () => {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const removeUser = useStore(state => state.removeUser)
    const user = useStore(state => state.user)
    const navigate = useNavigate()
    const userId = user.userId
    
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleGoHome = () => {
        navigate('/petitions')
    }
    const handleMyPetitions = () => {
        navigate('/myPetitions')
    }

    const handleOpenProfile = () => {
        console.log('View Profile')
        navigate('/profile')
    }
    const handleLogout = () => {
        removeUser(user)
        navigate('/')
    }
    const handleCreatePetition = () => {
        navigate('/create')
    }

    return (
        <Container maxWidth="lg" sx ={{ borderBottom: 1, borderColor: 'divider' }}>
            <React.Fragment>
                <Toolbar sx={{ display:'flex', justifyContent: 'space-between'}}>
                    <div onClick={handleGoHome} style ={{ cursor : 'pointer', marginLeft:'40px' }}>
                        <img src = "../Signed.png" style = {{ height : '100px', width: '200px'}} alt="Petition Site logo"></img>
                    </div>
                    <div style={{display:'flex'}}>
                        <Button variant="contained"
                                onClick={handleCreatePetition}
                                sx={{marginLeft: '30px', marginRight:'30px', display: { xs: 'none', md: 'block' }}}>
                            Create Petition</Button>
                        <Button sx={{marginRight:'30px', display: { xs: 'none', md: 'block' }}} onClick={handleMyPetitions}>My Petitions</Button>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar
                                        alt="User Image"
                                        src={`http://localhost:4941/api/v1/users/${userId}/image`}
                                        sx={{ width: 56, height: 56, marginRight:'50px'}}/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleOpenProfile}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </Box>
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar
                                    alt="User Image"
                                    src={`http://localhost:4941/api/v1/users/${userId}/image`}
                                    sx={{ width: 56, height: 56 }}/>
                            </IconButton>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleOpenProfile}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    </div>

                </Toolbar>
            </React.Fragment>
        </Container>
    )

}

export default UserNavbar;