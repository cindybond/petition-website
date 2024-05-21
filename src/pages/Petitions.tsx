import axios from 'axios';
import React from "react";
import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Pagination,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
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
import { useNavigate, useLocation } from 'react-router-dom'
import SearchNavbar from "../components/SearchNavbar";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import PetitionDetails from "./PetitionDetails";
import CasualNavbar from "../components/CasualNavbar";
import useStore from "../store";
import UserNavbar from "../components/UserNavbar";
const card: CSS.Properties = {
    margin: "20px",
}


const Petitions = () => {
    const [petition, setPetition] = React.useState < Array < Petition >> ([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [categories, setCategories] = React.useState < Array < Categories >>([])
    const [searchKey, setSearchKey] = React.useState("")
    const [costSearchKey, setCostSearchKey] = React.useState("")
    const [viewPetition, setViewPetition] = React.useState< Array < Petition >>([])
    const [filterCategory, setFilterCategory] = React.useState<number[]>([])
    const [sortBy, setSortBy] = React.useState("")
    const [pageSize, setPageSize] = React.useState(10)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [startIndex, setStartIndex] = React.useState(0)
    const url = 'http://localhost:4941/api/v1/petitions'
    const navigate = useNavigate()
    const user = useStore()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const ownerId = searchParams.get("ownerId");

    React.useEffect(() => {
        getPetition()
        getCategories()
        filterPetition(startIndex)
    }, [])


    const handleRegister = () => {
        navigate('/register')
    }

    const handleSignIn = () => {
        navigate('/login')
    }
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

    const filterPetition = (startIndex:number) => {
        let query = `?startIndex=${startIndex}&count=${pageSize}`

        if (searchKey) {
            query += '&q=' + searchKey
        }

        if (filterCategory) {
            if (filterCategory.length === 1) {
                query += '&categoryIds=' + filterCategory
            } else if (filterCategory.length > 1) {
                query += '&categoryIds=' + filterCategory[0]
                filterCategory.slice(1).forEach(category => {
                    query += '&categoryIds=' + category
                })

            }
        }

        if (costSearchKey) {
            query += '&supportingCost=' + costSearchKey
        }

        if (sortBy) {
            query += '&sortBy=' + sortBy
        }

        if(ownerId) {
            query += '&ownerId=' + ownerId
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

    const handleSort = (e:SelectChangeEvent) => {
        const selectedSort = e.target.value
        setSortBy(selectedSort)
    }

    const handlePageChange = (e: React.ChangeEvent<unknown>, page:number) => {
        setCurrentPage(page)
        const index = (page - 1) * pageSize
        console.log('check')
        console.log(index)
        setStartIndex(index);
        filterPetition(index)
    }

    const handlePetitionClicked = (petitionId:number) => {
        navigate('/petitions/' + petitionId)
    }

    const showFilteredPetition = () => {
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
                    {user.user.userId !== -1 ? <UserNavbar/> : <CasualNavbar handleRegister={handleRegister} handleSignIn={handleSignIn}/>}
                </div>
                <div>
                    <SearchNavbar startIndex={startIndex} searchKey={searchKey} setSearchKey={setSearchKey} filterCategory={filterCategory}
                                  setFilterCategory={setFilterCategory} categories={categories} filteredPetition={() => filterPetition(startIndex)}
                                    costSearchKey={costSearchKey} setCostSearchKey={setCostSearchKey} sortBy={sortBy}
                                    setSortBy={setSortBy} handleSort={handleSort}/>
                </div>
                <div>
                    {showFilteredPetition()}
                </div>
                <div style={{display:'flex' ,alignItems:'center', justifyContent:'center', marginTop:20, marginBottom:20}}>
                    <Stack spacing={2}>
                        <Pagination count={Math.ceil(petition.length/pageSize)} page={currentPage} color="secondary"
                                    onChange={handlePageChange} showFirstButton showLastButton/>
                    </Stack>
                </div>
            </div>

        )
    }
}

export default Petitions;