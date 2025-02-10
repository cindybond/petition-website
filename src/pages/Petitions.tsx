import axios from 'axios';
import React from "react";
import {
    Alert, AlertTitle,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Container,
    Pagination,
    Paper,
    SelectChangeEvent,
    Stack,
} from "@mui/material";
import CSS from 'csstype';


import Typography from "@mui/material/Typography";
import { useNavigate, useLocation } from 'react-router-dom'
import SearchNavbar from "../components/SearchNavbar";
import Avatar from "@mui/material/Avatar";
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
    const [numPage, setNumPage] = React.useState(0)
    const [viewPetition, setViewPetition] = React.useState< Array < Petition >>([])
    const [filterCategory, setFilterCategory] = React.useState<number[]>([])
    const [sortBy, setSortBy] = React.useState("")
    const [currentPage, setCurrentPage] = React.useState(1)
    const [startIndex, setStartIndex] = React.useState(0)
    const pageSize = 10
    const url = 'http://localhost:4941/api/v1/petitions'
    const navigate = useNavigate()
    const user = useStore()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const ownerId = searchParams.get("ownerId")


    React.useEffect(() => {
        getPetition()
        getCategories()
        filterPetition(startIndex)
        //eslint-disable-next-line
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
                console.log(petition)
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
        console.log(categories)
        const category = categories.find(cat => cat.id === categoryId);
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
                setNumPage(response.data.count)
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
                            <Card sx={{ maxWidth:500, maxHeight:800}}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 500, maxHeight:250, display: { xs: 'none', sm: 'block' } }}
                                    image={`http://localhost:4941/api/v1/petitions/${row.petitionId}/image`}
                                    alt="Petition Image"
                                />
                                <CardContent sx={{ flex: 1}}>
                                    <Typography component="h2" align='left' variant="h5" color='primary'>
                                        {row.title}
                                    </Typography>
                                    <Typography variant="subtitle2" align='left' sx={{fontSize:'16px' ,marginBottom:'20px'}}>
                                        Category: {getCategoryName(row.categoryId)}
                                    </Typography>
                                    <Typography variant="overline" noWrap={false} align='left' color="#e65100" sx={{fontSize:'18px'}}>
                                        Supporting Cost: ${row.supportingCost}
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
        return (
            <div>
                <Container maxWidth="lg" sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                {errorFlag &&
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>}
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
                        <Pagination count={Math.ceil(numPage/pageSize)} page={currentPage} color="secondary"
                                    onChange={handlePageChange} showFirstButton showLastButton/>
                    </Stack>
                </div>
                </Container>
            </div>

        )
    }


export default Petitions;