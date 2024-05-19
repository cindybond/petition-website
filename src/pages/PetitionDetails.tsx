import axios from "axios";
import React from "react";
import {useParams} from "react-router-dom";
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia, Divider, Icon,
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
const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
}



const PetitionDetails = () => {
    const { id } = useParams()
    const [similarPetition, setSimilarPetition] = React.useState < Array < Petition >> ([])
    const [petitionDetails, setPetitionDetails ] = React.useState < PetitionFull > ([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [supportTierDetails, setSupportTierDetails] = React.useState<Array< supportTier >>([])
    const [supporterDetails, setSupporterDetails] = React.useState< Array <supporter >>([])
    React.useEffect(() => {
        getDetails()
        getSupporters()
    }, [])
    const getDetails = () => {
        axios.get(`http://localhost:4941/api/v1/petitions/${id}`)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setPetitionDetails(response.data)
                setSupportTierDetails(response.data.supportTiers)
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
                        <Typography variant="overline" color='#4a148c' sx={{fontSize:'16px'}}>
                           COST: ${row.cost}
                        </Typography>
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
                <Divider />
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
                                <div style={{display: 'flex', alignItems: 'center', marginBottom:'30px'}}>
                                        <Avatar
                                            src={`http://localhost:4941/api/v1/users/${petitionDetails.ownerId}/image`}
                                            alt="User Image" sx={{marginTop: '10px'}}/>
                                        <Typography variant="caption" align='left'
                                                    sx={{marginLeft: '5px', marginTop: '10px'}}>
                                            {petitionDetails.ownerFirstName} {petitionDetails.ownerLastName} on {petitionDetails.creationDate}
                                        </Typography>
                                    </div>
                                </Typography>
                                <div style={{display: 'flex', justifyContent:'space-between'}}>
                                    <Typography  variant='subtitle1' sx={{fontSize: '20px', justifyContent:'left', alignItems:'left'}}>
                                        <PersonIcon fontSize='large'/> {petitionDetails.numberOfSupporters} supporters
                                    </Typography>
                                    <Typography variant='subtitle1' color="#e65100" sx={{fontSize: '20px', display: 'flex', alignItems:'right', justifyContent:'right'}}>
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
            {showPetitionDetails()}
        </div>
    )
}

export default PetitionDetails;