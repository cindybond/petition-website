import Toolbar from "@mui/material/Toolbar";
import {Button, Dialog, DialogActions, DialogTitle, Menu, MenuItem, styled, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from "react-router-dom";
import useStore from "../store";
import axios from "axios";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
const UserNavbar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [openDialog, setOpenDialog] = React.useState(false)
    const [ ownerId, setOwnerId]=React.useState(-1)
    const removeUser = useStore(state => state.removeUser)
    const user = useStore(state => state.user)
    const url = 'http://localhost:4941/api/v1'
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
        <div>
            <React.Fragment>
                <Toolbar sx={{display: 'flex', borderBottom: 1, borderColor: 'divider'}}>
                    <Button sx={{marginLeft:'40px', marginRight:'auto', fontSize:'40px'}} onClick={handleGoHome}>PETITION SITE</Button>
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
        </div>
    )

}

export default UserNavbar;