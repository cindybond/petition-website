import axios from "axios";
import React from "react";
import {useNavigate, useParams} from "react-router-dom";
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
    const [categories, setCategories] = React.useState < Array < Categories >>([])
    const url = 'http://localhost:4941/api/v1/petitions'
    const navigate = useNavigate()
    React.useEffect(() => {
        getDetails()
        getSupporters()
        getCategories()
    }, [id])
    const handlePetitionClicked = (petitionId:number) => {
        navigate('/petitions/' + petitionId)
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
    // const getSameOwner = (ownerId:number) => {
    //     axios.get(url + `?ownerId=${ownerId}`)
    //         .then((response) => {
    //             setErrorFlag(false)
    //             setErrorMessage("")
    //             const filterOwner = response.data.petitions
    //             const filteredOwner = filterOwner.filter((petition: Petition) => petition.petitionId !== parseInt(id!));
    //             setSimilarPetition(filteredOwner)
    //         }, (error) => {
    //             setErrorFlag(true)
    //             setErrorMessage(error.toString())
    //         })
    // }
    // const getSimilarPetitions = (categories:number) => {
    //     axios.get(`http://localhost:4941/api/v1/petitions?categoryIds=${categories}`)
    //         .then((response) => {
    //             setErrorFlag(false);
    //             setErrorMessage("");
    //             const filterData = response.data.petitions
    //             const filteredData = filterData.filter((petition: Petition) => petition.petitionId !== parseInt(id!));
    //             setSimilarPetition(filteredData);
    //         }, (error) => {
    //             setErrorFlag(true);
    //             setErrorMessage(error.toString());
    //         });
    // };

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
                const uniquePetitions = mergedPetitions.reduce((acc, curr) => {
                    return acc.includes(curr) ? acc : [...acc, curr];
                }, [])

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
            {showPetitionDetails()}
        </div>
    )
}

export default PetitionDetails;