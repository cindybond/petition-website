import axios from "axios";
import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Icon,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper
} from "@mui/material";
import CSS from "csstype";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import petitions from "./Petitions";
import UserNavbar from "../components/UserNavbar";
import CasualNavbar from "../components/CasualNavbar";
import useStore from "../store";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from '@mui/icons-material/Delete';
const card: CSS.Properties = {
    margin: "20px",
}

const PetitionDetails = () => {
    const { id } = useParams()
    const [similarPetition, setSimilarPetition] = React.useState < Array < Petition >> ([])
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [petitionDetails, setPetitionDetails ] = React.useState < PetitionFull > ([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [supportTierDetails, setSupportTierDetails] = React.useState<Array< supportTier >>([])
    const [supporterDetails, setSupporterDetails] = React.useState< Array <supporter >>([])
    const [categories, setCategories] = React.useState < Array < Categories >>([])
    const url = 'http://localhost:4941/api/v1/petitions'
    const navigate = useNavigate()
    const user = useStore()
    const userReturn = useStore(state => state.user)
    const token = userReturn.token
    const petitionOwner = petitionDetails.ownerId
    const petitionId = petitionDetails.petitionId
    React.useEffect(() => {
        getDetails()
        getSupporters()
        getCategories()
    }, [id])

    const handlePetitionClicked = (petitionId:number) => {
        navigate('/petitions/' + petitionId)
    }
    const handleRegister = () => {
        navigate('/register')
    }

    const handleSignIn = () => {
        navigate('/login')
    }

    const handleEditPetition = () => {
        navigate(`/edit/${petitionId}`)
    }

    const handleDeleteDialogOpen = () => {
        setOpenDeleteDialog(true)
    }
    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false)
    }

    const deletePetition =() => {
        axios.delete(url + `/${petitionId}`, {headers: {'X-Authorization': token}})
            .then ((response) => {
                handleDeleteDialogClose()
                console.log('deleted')
                navigate('/myPetitions')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const getDetails = () => {
        axios.get(`http://localhost:4941/api/v1/petitions/${id}`)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setPetitionDetails(response.data)
                setSupportTierDetails(response.data.supportTiers)
                getSimilarAndSameOwnerPetitions(response.data.categoryId, response.data.ownerId)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const getSupporters = () => {
        axios.get(`http://localhost:4941/api/v1/petitions/${id}/supporters`)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setSupporterDetails(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const getSimilarAndSameOwnerPetitions = (categoryId: number, ownerId: number) => {
        axios.all([
            axios.get(`${url}?categoryIds=${categoryId}`),
            axios.get(`${url}?ownerId=${ownerId}`)
        ])
            .then(axios.spread((similarResponse, ownerResponse) => {
                setErrorFlag(false);
                setErrorMessage("");

                const similarPetitions = similarResponse.data.petitions.filter((petition: Petition) => petition.petitionId !== parseInt(id!));
                const ownerPetitions = ownerResponse.data.petitions.filter((petition: Petition) => petition.petitionId !== parseInt(id!));

                const mergedPetitions = [...similarPetitions, ...ownerPetitions]

                //
                const uniquePetitions = mergedPetitions.reduce((acc: Petition[], curr: Petition) => {
                    // Check if the current petition's petitionId already exists in the accumulator array
                    if (!acc.some(petition => petition.petitionId === curr.petitionId)) {
                        // If not, add it to the accumulator
                        acc.push(curr);
                    }
                    return acc;
                }, []);

                console.log(mergedPetitions)
                console.log(uniquePetitions)
                setSimilarPetition(uniquePetitions);
            }))
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    }

    const getCategories = () => {
        axios.get(url + '/categories')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setCategories(response.data)
            } , (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const getCategoryName = (categoryId:number) => {
        const category = categories.find(cat => cat.categoryId === categoryId);
        return category ? category.name : '';
    }

    const getTierTitle = (supportTierId:number) => {
        const tier = supportTierDetails.find(tier => tier.supportTierId === supportTierId);
        return tier ? tier.title : '';
    }


    const showSupportTier = () => {
        return(
            <div>
                <div style={{margin: '10px'}}>
                    <Typography variant='button' sx={{fontSize:'22px'}}>
                        SUPPORT TIERS
                    </Typography>
                </div>
                <Divider/>
                {supportTierDetails.map((row: supportTier) => (
                    <div style={{margin:'30px'}}>
                        <Typography variant="button" sx={{fontSize: '18px'}}>
                            {row.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {row.description}
                        </Typography>
                        <Button variant="contained" color="secondary" sx={{marginTop:'10px'}}>SUPPORT ${row.cost}</Button>
                        <Divider sx={{marginTop:'30px'}}/>
                    </div>
                ))}
            </div>
        )
    }

    const showSupporter = () => {
        return (
            <div>
                <div style={{display:'flex', margin:'20px'}}>
                    <Typography variant="button" sx={{fontSize:'18px'}}>
                        SUPPORTERS
                    </Typography>
                </div>
                <Divider />
                {supporterDetails.map((supporter:supporter) => (
                    <div style={{margin:"12px"}}>
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '30px', marginLeft: '20px', marginRight:'20px'}}>
                            <Avatar
                                src={`http://localhost:4941/api/v1/users/${supporter.supporterId}/image`}
                                alt="User Image" sx={{marginTop: '10px'}}/>
                            <Typography variant="subtitle2" align='left'
                                        sx={{marginLeft: '5px', marginTop: '10px', fontSize: '14px'}}>
                                {supporter.supporterFirstName} {supporter.supporterLastName}
                            </Typography>
                            {supporter.message && (
                                <Typography variant="caption"
                                            sx={{marginTop: '10px', marginLeft: '10px', fontSize: '14px'}}>
                                    - "{supporter.message}"
                                </Typography>
                            )}
                        </div>
                        <div style={{display:'flex', marginLeft:'65px', marginRight:'20px', marginBottom:'10px', justifyContent:'space-between'}}>
                            <Typography variant="caption">
                                Tier: {getTierTitle(supporter.supportTierId)}
                            </Typography>
                            <Typography variant="caption">
                                {supporter.timestamp}
                            </Typography>
                        </div>
                        <Divider/>
                    </div>
                ))}
            </div>
        )
    }
    const showSimilarPetitions = () => {
        return(
            <div>
                <div style={{display: 'flex', margin: '20px'}}>
                    <Typography variant="button" sx={{fontSize: '18px'}}>
                        Similar Petitions
                    </Typography>
                </div>
                <Divider/>
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                    {similarPetition.map((row: Petition) => (
                        <Paper elevation={2} style={card} key={row.petitionId}>
                            <CardActionArea component="a" href="#"
                                             onClick={() => handlePetitionClicked(row.petitionId)}>
                                <Card sx={{width: 300}}>
                                    <CardMedia
                                        component="img"
                                        sx={{width: 300, maxHeight: 200, display: {xs: 'none', sm: 'block'}}}
                                        image={`http://localhost:4941/api/v1/petitions/${row.petitionId}/image`}
                                        alt="Petition Image"
                                    />
                                    <CardContent sx={{flex: 1}}>
                                        <Typography component="h2" align='left' variant="h5" color='primary'>
                                            {row.title}
                                        </Typography>
                                        <Typography variant="subtitle2" align='left'
                                                    sx={{fontSize: '16px', marginBottom: '20px'}}>
                                            Category: {getCategoryName(row.categoryId)}
                                        </Typography>
                                        <Typography variant="overline" noWrap={false} align='left' color="#e65100"
                                                    sx={{fontSize: '18px'}}>
                                            Supporting Cost: ${row.supportingCost}
                                        </Typography>
                                        <Typography variant="subtitle1" align='left' sx={{
                                            fontSize: '12px',
                                            justifyContent: 'flex-end',
                                            marginTop: '20px'
                                        }}>
                                            Created By:
                                        </Typography>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <Avatar src={`http://localhost:4941/api/v1/users/${row.ownerId}/image`}
                                                    alt="User Image" sx={{marginTop: '10px'}}/>
                                            <Typography variant="caption" align='left'
                                                        sx={{marginLeft: '5px', marginTop: '10px'}}>
                                                {row.ownerFirstName} {row.ownerLastName} on {row.creationDate}
                                            </Typography>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CardActionArea>
                        </Paper>
                    ))}
                </div>
            </div>
        )
    }
    const showPetitionDetails = () => {
        return (
            <div>
                {/*Main card*/}
                <Container sx={{display: 'flex', justifyContent: 'space-around'}}>
                    <Card sx={{width: 1000, marginTop: '40px', marginRight: '40px'}}>
                        <CardMedia
                            component="img"
                            sx={{width: 800, height: 400, objectFit: 'cover', display: {xs: 'none', sm: 'block'}}}
                            image={`http://localhost:4941/api/v1/petitions/${petitionDetails.petitionId}/image`}
                            alt="Petition Image"
                        />
                        <CardContent>
                            <div style={{textAlign: 'left'}}>
                                <Typography variant='button' fontSize='40px'>
                                    {petitionDetails.title}
                                </Typography>
                                <Typography>
                                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '30px'}}>
                                        <Avatar
                                            src={`http://localhost:4941/api/v1/users/${petitionDetails.ownerId}/image`}
                                            alt="User Image" sx={{marginTop: '10px'}}/>
                                        <Typography variant="caption" align='left'
                                                    sx={{marginLeft: '5px', marginTop: '10px'}}>
                                            {petitionDetails.ownerFirstName} {petitionDetails.ownerLastName} on {petitionDetails.creationDate}
                                        </Typography>
                                    </div>
                                </Typography>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Typography variant='subtitle1'
                                                sx={{fontSize: '20px', justifyContent: 'left', alignItems: 'left'}}>
                                        <PersonIcon fontSize='large'/> {petitionDetails.numberOfSupporters} supporters
                                    </Typography>
                                    <Typography variant='subtitle1' color="#e65100" sx={{
                                        fontSize: '20px',
                                        display: 'flex',
                                        alignItems: 'right',
                                        justifyContent: 'right'
                                    }}>
                                        <AttachMoneyIcon fontSize='large'/> {petitionDetails.moneyRaised} raised!
                                    </Typography>
                                </div>

                                <Divider/>
                                <div style={{marginTop: '30px'}}>
                                    <Typography variant="body1">
                                        {petitionDetails.description}
                                    </Typography>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/*Support Tier Card*/}
                    <Card sx={{width: 400, marginTop: '40px'}}>
                        {showSupportTier()}
                    </Card>
                </Container>
                <Container sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Card sx={{width:600, marginTop:'40px', marginRight:'40px', marginBottom:'40px'}}>
                        {showSupporter()}
                    </Card>
                    <Card sx={{width:600, marginTop:'40px', marginBottom:'40px'}}>
                        {showSimilarPetitions()}
                    </Card>
                </Container>
            </div>
        )
    }

    return (
        <div>
            <div>
                {user.user.userId !== -1 ? <UserNavbar/> : <CasualNavbar handleRegister={handleRegister} handleSignIn={handleSignIn}/>}
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginRight: '20px', marginTop:'20px'}}>
                {user.user.userId === petitionOwner ? <Button variant="outlined" size='large' onClick={handleEditPetition}
                                                              startIcon={<ModeEditOutlineIcon/>}>EDIT PETITION</Button> : ""}
                {user.user.userId === petitionOwner ? <Button variant="contained" size='large' color='warning' onClick={handleDeleteDialogOpen}
                                                              sx={{marginLeft:'20px'}}
                                                              startIcon={<DeleteIcon />}>DELETE PETITION</Button> : ""}
                {/*Delete Dialog*/}
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleDeleteDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="aler-dialog-title">
                        {"Delete User?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this petition?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="error"  onClick={() => {
                            deletePetition()}} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>


            </div>


            {showPetitionDetails()}
        </div>
    )
}

export default PetitionDetails;