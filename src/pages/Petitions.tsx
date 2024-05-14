import axios from 'axios';
import React from "react";
import {
    Box,
    Button, Checkbox, FormControl, InputLabel, MenuItem, OutlinedInput,
    Paper, Select, Slider,
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
const card: CSS.Properties = {
    padding: "10px",
    margin: "20px"
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
    const [filteredPetition, setFilteredPetition] = React.useState< Array < Petition >>([])
    const [filterCategory, setFilterCategory] = React.useState<number[]>([])
    const [filterCost, setFilterCost] = React.useState<number[]>([])
    React.useEffect(() => {
        getPetition()
        getCategories()
    }, [])
    const getPetition = () => {
        axios.get('http://localhost:4941/api/v1/petitions')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setPetition(response.data.petitions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const getCategories = () => {
        axios.get('http://localhost:4941/api/v1/petitions/categories')
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
        console.log("What's here",categories)
        const filtered = petition.filter(petition =>
            petition.title.toLowerCase().includes(searchKey.toLowerCase())
            && filterCategory.includes(petition.categoryId));
        setFilteredPetition(filtered);
    }


    const petition_rows = () => {
        return filteredPetition.map((row: Petition) =>
            <TableRow hover
                      tabIndex={-1}
                      key={row.petitionId}>
                <TableCell>{row.petitionId}</TableCell>
                <TableCell>
                    <img src={'http://localhost:4941/api/v1/petitions/' + row.petitionId + '/image'}
                         alt='Petition Image' width='100px'></img>
                </TableCell>
                <TableCell align="left">{row.title}</TableCell>
                <TableCell>{row.creationDate}</TableCell>
                <TableCell>{row.ownerFirstName} {row.ownerLastName}
                    <img src={'http://localhost:4941/api/v1/users/' + row.ownerId + '/image'}
                    alt="User Image" width="100px" ></img>
                </TableCell>
                <TableCell>{row.supportingCost}</TableCell>
                <TableCell>{getCategoryName(row.categoryId)}</TableCell>

            </TableRow>
        )
    }

    if(errorFlag) {
        return (
            <div>
                <h1>Users</h1>
                <div style={{ color: "red" }}>
                    {errorMessage}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div style={{marginTop:"20px"}}>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <TextField id="outlined-basic" label="Search for petition" variant="outlined" size="small"
                                   value={searchKey} onChange={ e => {
                            setSearchKey(e.target.value)}}></TextField>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            multiple
                            value={filterCategory}
                            onChange={(e:any) => setFilterCategory(e.target.value)}
                        >
                            {categories.map((row) => (
                                <MenuItem key={row.categoryId} value={row.categoryId}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ m:1, width: 300 }}>
                        <Slider
                            value={filterCost}
                            onChange={(e:any) => setFilterCost(e.target.value)}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                    <Button onClick={filterPetition}>Search</Button>

                </div>
                <Paper elevation={3} style={card}>
                    <h1>Petitions</h1>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align={'left'}
                                            padding={'normal'}>
                                            {headCell.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {petition_rows()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        )
    }
}

export default Petitions;