import UserNavbar from "../components/UserNavbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {Alert, Button, Snackbar, TextField} from "@mui/material";
import React from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import useStore from "../store";

const EditPetition = () => {
    let { petitionId} = useParams()
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const [petition, setPetition] = React.useState < PetitionFull > ([])
    const [petitionImage, setPetitionImage] = React.useState<File|null>(null)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [petitionData, setPetitionData] = React.useState<createPetition>({
        title: "",
        description: "",
        categoryId: 0,
        supportTiers: [{
            title: "",
            description: "",
            cost: 0
        }]
    });
    const url = 'http://localhost:4941/api/v1/petitions/'
    const navigate = useNavigate()
    const user = useStore(state => state.user)
    const token = user.token
    React.useEffect(() => {
        getPetition()
    }, [])
    const getPetition = () => {
        axios.get(url + petitionId)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setPetition(response.data)
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
    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
            }
        setSnackOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

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
    console.log(petitionData.title)
    const patchPetition = () => {
        axios.patch(url + petitionId, petitionData , {headers: {'X-Authorization': token}})
            .then((response) => {
                console.log('Patched')
                setSnackMessage("Petition Successfully Edited")
                setSnackOpen(true)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const showEditForm = () => {
        return (
            <Container sx={{display: 'flex', justifyContent: 'space-around'}}>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        border: '1px solid grey',
                        borderRadius: 2,
                        padding: '20px'
                    }}
                >
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

                        </Grid>

                        {/*Support Tiers*/}
                        <Box sx={{mt: 4}}>
                            <div style={{display: 'flex', marginBottom: '5px'}}>
                                <Typography variant="button">
                                    Support Tiers
                                </Typography>
                            </div>
                            {/*<Grid container spacing={2}>*/}
                            {/*    <Grid item xs={12} sm={4}>*/}
                            {/*        <TextField*/}
                            {/*            required*/}
                            {/*            fullWidth*/}
                            {/*            label="Title"*/}
                            {/*            id="support-tiers-title1"*/}
                            {/*            name='supportTiers0title'*/}
                            {/*            onChange={handleChange}*/}
                            {/*        />*/}
                            {/*    </Grid>*/}
                            {/*    <Grid item xs={12} sm={4}>*/}
                            {/*        <TextField*/}
                            {/*            required*/}
                            {/*            fullWidth*/}
                            {/*            label="Description"*/}
                            {/*            id="support-tiers-desc1"*/}
                            {/*            name="supportTiers0description"*/}
                            {/*            onChange={handleChange}*/}
                            {/*        />*/}
                            {/*    </Grid>*/}
                            {/*    <Grid item xs={12} sm={4}>*/}
                            {/*        <TextField*/}
                            {/*            required*/}
                            {/*            fullWidth*/}
                            {/*            label="Cost"*/}
                            {/*            id="support-tiers-cost1"*/}
                            {/*            name="supportTiers0cost"*/}
                            {/*            onChange={handleChange}*/}
                            {/*        />*/}
                            {/*    </Grid>*/}
                            {/*    <Grid item xs={12} sm={4}>*/}
                            {/*        <TextField*/}
                            {/*            fullWidth*/}
                            {/*            label="Title"*/}
                            {/*            id="support-tiers-title2"*/}
                            {/*            name='supportTiers1title'*/}
                            {/*            onChange={handleChange}*/}
                            {/*        />*/}
                            {/*    </Grid>*/}
                            {/*    <Grid item xs={12} sm={4}>*/}
                            {/*        <TextField*/}
                            {/*            fullWidth*/}
                            {/*            label="Description"*/}
                            {/*            id="support-tiers-desc2"*/}
                            {/*            name='supportTiers1description'*/}
                            {/*            onChange={handleChange}*/}
                            {/*        />*/}
                            {/*    </Grid>*/}
                            {/*    <Grid item xs={12} sm={4}>*/}
                            {/*        <TextField*/}
                            {/*            fullWidth*/}
                            {/*            label="Cost"*/}
                            {/*            id="support-tiers-cost2"*/}
                            {/*            name='supportTiers1cost'*/}
                            {/*            onChange={handleChange}*/}
                            {/*        />*/}
                            {/*    </Grid>*/}
                            {/*    <Grid item xs={12} sm={4}>*/}
                            {/*        <TextField*/}
                            {/*            fullWidth*/}
                            {/*            label="Title"*/}
                            {/*            id="support-tiers-title3"*/}
                            {/*            name='supportTiers2title'*/}
                            {/*            onChange={handleChange}*/}
                            {/*        />*/}
                            {/*    </Grid>*/}
                            {/*    <Grid item xs={12} sm={4}>*/}
                            {/*        <TextField*/}
                            {/*            fullWidth*/}
                            {/*            label="Description"*/}
                            {/*            id="support-tiers-desc3"*/}
                            {/*            name='supportTiers2description'*/}
                            {/*            onChange={handleChange}*/}
                            {/*        />*/}
                            {/*    </Grid>*/}
                            {/*    <Grid item xs={12} sm={4}>*/}
                            {/*        <TextField*/}
                            {/*            fullWidth*/}
                            {/*            label="Cost"*/}
                            {/*            id="support-tiers-cost3"*/}
                            {/*            name='supportTiers2cost'*/}
                            {/*            onChange={handleChange}*/}
                            {/*        />*/}
                            {/*    </Grid>*/}
                            {/*</Grid>*/}
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{mt: 5, mb: 4}}
                        >
                            SAVE
                        </Button>
                    </Box>

                </Box>
            </Container>
        )
    }


    return (
        <div>
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
        </div>
    );
}

export default EditPetition;