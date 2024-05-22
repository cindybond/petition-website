import React from "react";
import Container from "@mui/material/Container";
import {Button, Card, CardContent, Divider, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import UserNavbar from "../components/UserNavbar";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import useStore from "../store";

const CreatePetition = () => {
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

    const url = 'http://localhost:4941/api/v1/petitions'
    const navigate = useNavigate()
    const user = useStore(state => state.user)
    const token = user.token

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





    console.log(petitionData)


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(petitionData)
        postPetition();
    };
    const handleImageChange = (e:any) => {
        setPetitionImage(e.target.files[0])
    }

    const postPetition = () => {
        axios.post(url , petitionData, {headers: {'X-Authorization': user.token}})
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                console.log('Created')
                console.log(response.data)
                const petitionId = response.data.petitionId
                console.log(petitionId)
                uploadImage(petitionId, token)
                navigate('/')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const uploadImage = (petitionId:number, token:string) => {
        console.log('check')
        if(petitionImage!== null) {
            axios.put(url + `/${petitionId}/image`, petitionImage ,{headers: {'Content-Type':petitionImage?.type, 'X-Authorization': token}})
                .then((response) => {
                    console.log('image uploaded')
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
    }
    return (
        <div>
            <div>
                <UserNavbar/>
            </div>
            <Container sx={{display: 'flex', justifyContent: 'space-around'}}>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        border: '1px solid grey',
                        borderRadius: 2,
                        padding:'20px'
                    }}
                >
                    <Typography variant="h4">
                        CREATE PETITION
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={7}>
                                <TextField
                                    required
                                    fullWidth
                                    id="title"
                                    label="Title"
                                    name="title"
                                    autoFocus
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
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    id="support-tiers-title2"
                                    name='supportTiers1title'
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    id="support-tiers-desc2"
                                    name='supportTiers1description'
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Cost"
                                    id="support-tiers-cost2"
                                    name='supportTiers1cost'
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    id="support-tiers-title3"
                                    name='supportTiers2title'
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    id="support-tiers-desc3"
                                    name='supportTiers2description'
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Cost"
                                    id="support-tiers-cost3"
                                    name='supportTiers2cost'
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Typography variant="caption" align='right'> * marks required field</Typography>
                    </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{mt: 5, mb: 4}}
                        >
                        CREATE
                        </Button>
                </Box>

                </Box>
            </Container>
        </div>
    );
}

export default CreatePetition;