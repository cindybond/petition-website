import UserNavbar from "../components/UserNavbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {Alert, AlertTitle, Button, Paper, Snackbar, TextField} from "@mui/material";
import React from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import useStore from "../store";
import CSS from "csstype";
const card: CSS.Properties = {
    margin: "20px",
    padding: "20px"
}

const EditPetition = () => {
    let { petitionId} = useParams()
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const [errorOpen, setErrorOpen] = React.useState(false)
    const [snackError, setSnackError] = React.useState("")
    const [petitionImage, setPetitionImage] = React.useState<File|null>(null)
    const [petitionFull, setPetitionFull] = React.useState<PetitionFull>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [petitionData, setPetitionData] = React.useState<createPetition>({
        title: "",
        description: "",
        categoryId: 0,
        supportTiers: [
            { title: "", description: "", cost: 0 },
            { title: "", description: "", cost: 0 },
            { title: "", description: "", cost: 0 }
        ]
    });
    const url = 'http://localhost:4941/api/v1/petitions/'
    const navigate = useNavigate()
    const user = useStore(state => state.user)
    const token = user.token
    React.useEffect(() => {
        const getPetition = () => {
            axios.get(url + petitionId)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setPetitionFull(response.data)
                    setPetitionData({
                        title: response.data.title,
                        description: response.data.description,
                        categoryId: response.data.categoryId,
                        supportTiers: response.data.supportTiers || [{ title: "", description: "", cost: 0 }]
                    })
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getPetition()
    }, [petitionId])

    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
            }
        setSnackOpen(false);
    };
    const handleErrorClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
    };

    const handleImageChange = (e:any) => {
        setPetitionImage(e.target.files[0])
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(petitionData)
        if (name.startsWith("supportTiers")) {
            const tierIndex = parseInt(name.substring("supportTiers".length), 10)
            const updatedSupportTiers = [...petitionData.supportTiers];
            if (!updatedSupportTiers[tierIndex]) {
                updatedSupportTiers[tierIndex] = { title: "", description: "", cost: 0 }; // Initialize with empty values
            }
            if (name.endsWith("cost")) {
                // Parse the value to an integer
                updatedSupportTiers[tierIndex].cost = parseInt(value, 10);
            } else {
                (updatedSupportTiers[tierIndex]as any)[name.substring("supportTiers".length + tierIndex.toString().length)] = value;
            }

            const newData = { ...petitionData, supportTiers: updatedSupportTiers };
            setPetitionData(newData);
        } else {
            const parsedValue = name === "categoryId" ? parseInt(value, 10) : value;
            const newData = { ...petitionData, [name]: parsedValue };
            setPetitionData(newData);
        }
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        patchPetition();
    };

    const patchPetition = () => {
        axios.patch(url + petitionId, petitionData , {headers: {'X-Authorization': token}})
            .then((response) => {
                console.log('Patched')
                console.log(petitionData)
                uploadImage(petitionId, token)
                patchSupportTier1()
                if(petitionFull.supportTiers[1] !== undefined) {
                    patchSupportTier2()
                } else {
                    console.log('going to put')
                    putSupportTier2()
                }
                if(petitionFull.supportTiers[2] !== undefined) {
                    patchSupportTier3()
                } else {
                    console.log('going to put')
                    putSupportTier3()
                }
                setSnackMessage("Petition Successfully Edited")
                setSnackOpen(true)
                setTimeout(() => {
                    navigate('/myPetitions')
                },1000)
            }, (error) => {
                setSnackError(error.response.statusText.toString())
                setErrorOpen(true)
            })
    }

    const patchSupportTier1 = () => {
        const tierId = petitionFull.supportTiers[0].supportTierId
        console.log(petitionData.supportTiers[0])
        axios.patch(url + `${petitionId}/supportTiers/${tierId}`,petitionData.supportTiers[0],{headers: {'X-Authorization': token}})
            .then((response) => {
                console.log('support tier patched')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const patchSupportTier2 = () => {
        const tierId = petitionFull.supportTiers[1].supportTierId
        console.log(petitionData.supportTiers[1])
        axios.patch(url + `${petitionId}/supportTiers/${tierId}`,petitionData.supportTiers[1],{headers: {'X-Authorization': token}})
            .then((response) => {
                console.log('support tier patched')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const putSupportTier2 = () => {
        axios.put(url + `${petitionId}/supportTiers`, petitionData.supportTiers[1],{headers: {'X-Authorization': token}})
            .then((response) => {
                console.log('support tier patched')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const patchSupportTier3 = () => {
        const tierId = petitionFull.supportTiers[2].supportTierId
        console.log(petitionData.supportTiers[2])
        axios.patch(url + `${petitionId}/supportTiers/${tierId}`,petitionData.supportTiers[2],{headers: {'X-Authorization': token}})
            .then((response) => {
                console.log('support tier patched')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const putSupportTier3 = () => {
        axios.put(url + `${petitionId}/supportTiers`, petitionData.supportTiers[2],{headers: {'X-Authorization': token}})
            .then((response) => {
                console.log('support tier patched')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const uploadImage = (petitionId:string|undefined, token:string) => {
        console.log('check')
        if(petitionImage!== null) {
            axios.put(url + `${petitionId}/image`, petitionImage ,{headers: {'Content-Type':petitionImage?.type, 'X-Authorization': token}})
                .then((response) => {
                    console.log('image uploaded')
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
    }

    const showEditForm = () => {
        return (
            <Container sx={{display: 'flex', justifyContent: 'space-around'}}>
                <Paper elevation={3} style={card}>

                        <Typography variant="h4">
                            EDIT PETITION
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={7}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="title"
                                        value={petitionData.title}
                                        label="Title"
                                        name="title"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={7}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="description"
                                        label="Description"
                                        name="description"
                                        value={petitionData.description}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={7}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="category-id"
                                        label="Category ID"
                                        name="categoryId"
                                        value={petitionData.categoryId}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={5} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography>Upload Petition Image</Typography>
                                    <input type="file" id="myFile" name="filename" accept="image/*" onChange={handleImageChange} />
                                    {petitionImage && (
                                        <div>
                                            <img
                                                alt="not found"
                                                width={"250px"}
                                                src={URL.createObjectURL(petitionImage)}
                                            />
                                            <br /> <br />
                                            <button onClick={() => setPetitionImage(null)}>Remove</button>
                                        </div>
                                    )}
                                </Grid>

                            </Grid>

                            {/*Support Tiers*/}
                            <Box sx={{mt: 4}}>
                                <div style={{display: 'flex', marginBottom: '5px'}}>
                                    <Typography variant="button">
                                        Support Tiers
                                    </Typography>
                                </div>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Title"
                                            id="support-tiers-title1"
                                            name='supportTiers0title'
                                            value={petitionData.supportTiers[0].title}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Description"
                                            id="support-tiers-desc1"
                                            name="supportTiers0description"
                                            value={petitionData.supportTiers[0].description}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Cost"
                                            id="support-tiers-cost1"
                                            name="supportTiers0cost"
                                            value={petitionData.supportTiers[0].cost}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Title"
                                            id="support-tiers-title2"
                                            name='supportTiers1title'
                                            value={petitionData.supportTiers[1] !== undefined ? petitionData.supportTiers[1].title : ''}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            id="support-tiers-desc2"
                                            name='supportTiers1description'
                                            value={petitionData.supportTiers[1] !== undefined ? petitionData.supportTiers[1].description : ''}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Cost"
                                            id="support-tiers-cost2"
                                            name='supportTiers1cost'
                                            // value={petitionData.supportTiers[1] !== undefined ? petitionData.supportTiers[1].cost : 0}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Title"
                                            id="support-tiers-title3"
                                            name='supportTiers2title'
                                            value={petitionData.supportTiers[2] !== undefined ? petitionData.supportTiers[2].title : ''}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            id="support-tiers-desc3"
                                            name='supportTiers2description'
                                            value={petitionData.supportTiers[2] !== undefined ? petitionData.supportTiers[2].description : ''}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Cost"
                                            id="support-tiers-cost3"
                                            name='supportTiers2cost'
                                            // value={petitionData.supportTiers[2] !== undefined ? petitionData.supportTiers[2].cost : 0}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                sx={{mt: 5, mb: 4}}
                            >
                                SAVE
                            </Button>
                        </Box>
                </Paper>
            </Container>
        )
    }
    return (
        <div>
            {errorFlag &&
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>}
            <div>
                <UserNavbar/>
            </div>
            {showEditForm()}

            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                autoHideDuration={3000}
                open={snackOpen}
                onClose={handleSnackClose}
                key={snackMessage}
            >
                <Alert onClose={handleSnackClose} severity="success" sx={{
                    width:'100%'
                }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
            {/*Error Snackbar*/}
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                autoHideDuration={3000}
                open={errorOpen}
                onClose={handleErrorClose}
                key={snackError}
            >
                <Alert onClose={handleErrorClose} severity="error" sx={{
                    width:'100%'
                }}>
                    {snackError}
                </Alert>
            </Snackbar>
        </div>
    );
}



export default EditPetition;