import axios from 'axios';
import React from "react";
import {
    Button, Card, CardActionArea, CardContent, CardMedia, Checkbox, FormControl, InputLabel, MenuItem, OutlinedInput,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import CSS from 'csstype';

import {Category} from "@mui/icons-material";
import {Menubar} from "primereact/menubar";
import Typography from "@mui/material/Typography";
import Home from "./Home";
import SearchNavbar from "../components/SearchNavbar";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
}
interface HeadCell {
    id: string;
    label: string;
    numeric: boolean;
}
const headCells: readonly HeadCell[] = [
    { id: 'petitionID', label: 'Petition ID', numeric: true },
    { id: 'petitionImage' , label:'Petition Image', numeric: false },
    { id: 'title', label: 'Title', numeric: false },
    { id: 'creationDate', label:'Created on', numeric: false },
    { id: 'ownerFirstName', label:'Created by', numeric: false },
    { id: 'supportingCost', label:'Supporting Cost', numeric: true},
    { id: 'category', label:'Category', numeric: false }

]

const Petitions = () => {
    const [petition, setPetition] = React.useState < Array < Petition >> ([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [categories, setCategories] = React.useState < Array < Categories >>([])
    const [searchKey, setSearchKey] = React.useState("")
    const [costSearchKey, setCostSearchKey] = React.useState("")
    const [viewPetition, setViewPetition] = React.useState< Array < Petition >>([])
    const [filterCategory, setFilterCategory] = React.useState<number[]>([])
    const url = 'http://localhost:4941/api/v1/petitions'


    React.useEffect(() => {
        getPetition()
        getCategories()
    }, [])
    const getPetition = () => {
        axios.get(url)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setPetition(response.data.petitions)
                setViewPetition(response.data.petitions)
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

    const getCategoryName = (categoryId:number) => {
        const category = categories.find(cat => cat.categoryId === categoryId);
        return category ? category.name : '';
    }

    const filterPetition = () => {
        console.log('Whats here', filterCategory)
        let query = ''
        if (searchKey !== "" && filterCategory.length === 0 && costSearchKey.length === 0) {
            query += '?q=' + searchKey
        }
        if (searchKey === "" && filterCategory.length === 0 && costSearchKey.length !== 0) {
            query += '?supportingCost=' + costSearchKey
        }
        if (searchKey !== "" && filterCategory.length === 0 && costSearchKey.length !== 0) {
            query += '?q=' + searchKey + '&supportingCost=' + costSearchKey
        }
        if (searchKey === "" && filterCategory.length !== 0 && costSearchKey.length === 0){
            if (filterCategory.length === 1) {
                query += '?categoryIds=' + filterCategory
            } else if (filterCategory.length > 1) {
                query += '?categoryIds=' + filterCategory[0]
                filterCategory.slice(1).forEach(category => {
                    query += '&categoryIds=' + category
                })

            }
        }
        if (searchKey !== "" && filterCategory.length !== 0 && costSearchKey.length === 0) {
            console.log('check')
            if (filterCategory.length === 1) {
                query += '?q=' + searchKey + '&categoryIds=' + filterCategory
            } else if (filterCategory.length > 1) {
                query += '?q=' + searchKey + '&categoryIds=' + filterCategory[0]
                filterCategory.slice(1).forEach(category => {
                    query += '&categoryIds=' + category
                })

            }
        }
        if (searchKey !== "" && filterCategory.length !== 0 && costSearchKey.length !== 0) {
            console.log('check')
            if (filterCategory.length === 1) {
                query += '?q=' + searchKey + '&supportingCost=' + costSearchKey + '&categoryIds=' + filterCategory
            } else if (filterCategory.length > 1) {
                query += '?q=' + searchKey + '&supportingCost=' + costSearchKey + '&categoryIds=' + filterCategory[0]
                filterCategory.slice(1).forEach(category => {
                    query += '&categoryIds=' + category
                })

            }
        }
        if (searchKey === "" && filterCategory.length !== 0 && costSearchKey.length !== 0){
            if (filterCategory.length === 1) {
                query += '?supportingCost=' + costSearchKey + '&categoryIds=' + filterCategory
            } else if (filterCategory.length > 1) {
                query += '?supportingCost=' + costSearchKey + '&categoryIds=' + filterCategory[0]
                filterCategory.slice(1).forEach(category => {
                    query += '&categoryIds=' + category
                })

            }
        }

        axios.get(url + query)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setViewPetition(response.data.petitions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const showFilteredPetition = () => {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {viewPetition.map((row: Petition) => (
                    <Paper elevation={3} style={card} key={row.petitionId}>
                        <CardActionArea component="a" href="#">
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
    }


    if (errorFlag) {
        return (
            <div>
                <h1>Users</h1>
                <div style={{color: "red"}}>
                    {errorMessage}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div>
                    <React.Fragment>
                        <Toolbar sx={{ display:'flex', borderBottom: 1, borderColor: 'divider'}}>
                            <Link href="#" underline="none" color="inherit" sx={{flex:1}}>
                                <Typography variant="h4" align="left">PETITION SITE</Typography>
                            </Link>

                            <Button variant="outlined" href="http://localhost:8080/register" sx={{margin:'10px'}}>
                                Register
                            </Button>
                            <Button variant="outlined" href="http://localhost:8080/login">
                                Sign In
                            </Button>
                        </Toolbar>
                    </React.Fragment>
                </div>
                <div>
                    <SearchNavbar searchKey={searchKey} setSearchKey={setSearchKey} filterCategory={filterCategory}
                                  setFilterCategory={setFilterCategory} categories={categories} filteredPetition={filterPetition}
                                    costSearchKey={costSearchKey} setCostSearchKey={setCostSearchKey}/>
                </div>
                <div>
                    {showFilteredPetition()}
                </div>
            </div>

        )
    }
}

export default Petitions;