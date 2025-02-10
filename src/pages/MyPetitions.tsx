import axios from "axios";
import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import {Alert, AlertTitle, Box, Card, CardActionArea, CardContent, CardMedia, Container, Paper, Tab, Tabs} from "@mui/material";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CSS from "csstype";
import useStore from "../store";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import UserNavbar from "../components/UserNavbar";
const card: CSS.Properties = {
    margin: "20px",
}

const MyPetitions = () => {
    const [petition, setPetition] = React.useState < Array < Petition >> ([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [categories, setCategories] = React.useState < Array < Categories >>([])
    const [viewPetition, setViewPetition] = React.useState< Array < Petition >>([])
    const [supportedPetition, setSupportedPetition] = React.useState<Array<Petition>>([])
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const url = 'http://localhost:4941/api/v1/petitions'
    const navigate = useNavigate()
    const user = useStore(state => state.user)
    const ownerId = user.userId


    React.useEffect(() =>{
        getPetition()
        getSupportedPetitions()
        getCategories()
        //eslint-disable-next-line
    },[])

    const handlePetitionClicked = (petitionId:number) => {
        navigate('/petitions/' + petitionId)
    }
    const getPetition = () => {
        axios.get(url + '?ownerId=' + ownerId)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setPetition(response.data.petitions)
                console.log(petition)
                setViewPetition(response.data.petitions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const getSupportedPetitions = () => {
        axios.get(url + '?supporterId=' + ownerId)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setSupportedPetition(response.data.petitions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
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
    console.log(viewPetition.length)
    const getCategoryName = (categoryId:number) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : '';
    }
    const showMyPetition = () => {
        if(viewPetition.length !== 0) {
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {viewPetition.map((row: Petition) => (
                        <Paper elevation={5} style={card} key={row.petitionId}>
                            <CardActionArea component="a" href="#" onClick={() => handlePetitionClicked(row.petitionId)}>
                                <Card sx={{ maxWidth:500 }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 500, maxHeight:200, display: { xs: 'none', sm: 'block' } }}
                                        image={`http://localhost:4941/api/v1/petitions/${row.petitionId}/image`}
                                        alt="Petition Image"
                                    />
                                    <CardContent sx={{ flex: 1 }}>
                                        <Typography component="h2" align='left' variant="h5" color='primary'>
                                            {row.title}
                                        </Typography>
                                        <Typography variant="subtitle2" align='left' sx={{fontSize:'16px' ,marginBottom:'20px'}}>
                                            Category: {getCategoryName(row.categoryId)}
                                        </Typography>
                                        <Typography variant="overline" noWrap={false} align='left' color="#e65100" sx={{fontSize:'18px'}}>
                                            Supporting Cost: ${row.supportingCost}
                                        </Typography>
                                        <Typography variant="subtitle1" align='left' sx={{fontSize:'12px', justifyContent: 'flex-end', marginTop:'20px'}}>
                                            Created By:
                                        </Typography>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <Avatar src={`http://localhost:4941/api/v1/users/${row.ownerId}/image`}
                                                    alt="User Image" sx={{marginTop:'10px'}}/>
                                            <Typography variant="caption" align='left' sx={{marginLeft: '5px', marginTop:'10px'}}>
                                                {row.ownerFirstName} {row.ownerLastName} on {row.creationDate}
                                            </Typography>
                                        </div>
                                    </CardContent>

                                </Card>
                            </CardActionArea>
                        </Paper>
                    ))}
                </div>
            );
        } else {
            return(
                <div style={{display:'flex', justifyContent:'space-around', marginTop:'90px'}}>
                    <Typography>
                        Looks empty here... Go create a petition
                        <ArrowOutwardIcon sx={{fontSize:'40px', marginLeft:'20px'}}/>
                    </Typography>
                </div>
            )
        }
    }
    const showSupportedPetition = () => {
        if(supportedPetition.length !== 0) {
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {supportedPetition.map((row: Petition) => (
                        <Paper elevation={5} style={card} key={row.petitionId}>
                            <CardActionArea component="a" href="#" onClick={() => handlePetitionClicked(row.petitionId)}>
                                <Card sx={{ maxWidth:500 }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 500, maxHeight:200, display: { xs: 'none', sm: 'block' } }}
                                        image={`http://localhost:4941/api/v1/petitions/${row.petitionId}/image`}
                                        alt="Petition Image"
                                    />
                                    <CardContent sx={{ flex: 1 }}>
                                        <Typography component="h2" align='left' variant="h5" color='primary'>
                                            {row.title}
                                        </Typography>
                                        <Typography variant="subtitle2" align='left' sx={{fontSize:'16px' ,marginBottom:'20px'}}>
                                            Category: {getCategoryName(row.categoryId)}
                                        </Typography>
                                        <Typography variant="overline" noWrap={false} align='left' color="#e65100" sx={{fontSize:'18px'}}>
                                            Supporting Cost: ${row.supportingCost}
                                        </Typography>
                                        <Typography variant="subtitle1" align='left' sx={{fontSize:'12px', justifyContent: 'flex-end', marginTop:'20px'}}>
                                            Created By:
                                        </Typography>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <Avatar src={`http://localhost:4941/api/v1/users/${row.ownerId}/image`}
                                                    alt="User Image" sx={{marginTop:'10px'}}/>
                                            <Typography variant="caption" align='left' sx={{marginLeft: '5px', marginTop:'10px'}}>
                                                {row.ownerFirstName} {row.ownerLastName} on {row.creationDate}
                                            </Typography>
                                        </div>
                                    </CardContent>

                                </Card>
                            </CardActionArea>
                        </Paper>
                    ))}
                </div>
            );
        } else {
            return(
                <div style={{display:'flex', justifyContent:'space-around', marginTop:'90px'}}>
                    <Typography>
                        Looks empty here... Go support a petition
                    </Typography>
                </div>
            )
        }
    }
    return (
        <Container maxWidth="lg">
            {errorFlag &&
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>}
            <div>
                <UserNavbar/>
            </div>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange} aria-label="petition tabs">
                    <Tab label="Started" />
                    <Tab label="Supported" />
                </Tabs>
            </Box>

            {value === 0 && (
                <Box sx={{ p: 3 }}>
                    {showMyPetition()} 
                </Box>
            )}

            {value === 1 && (
                <Box sx={{ p: 3 }}>
                    {showSupportedPetition()} 
                </Box>
            )}
        </Container>
    )
}

export default MyPetitions;