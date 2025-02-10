import {Button, Checkbox, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import React from "react";


interface SearchNavbarProps {
    startIndex:number,
    searchKey: string,
    setSearchKey: React.Dispatch<React.SetStateAction<string>>,
    filterCategory:number[],
    setFilterCategory:React.Dispatch<React.SetStateAction<number[]>>,
    categories:Categories[],
    filteredPetition:(startIndex:number)=>void,
    costSearchKey: string,
    setCostSearchKey:React.Dispatch<React.SetStateAction<string>>
    sortBy:string,
    setSortBy:React.Dispatch<React.SetStateAction<string>>
    handleSort:(e:SelectChangeEvent)=>void
}
const SearchNavbar = (props:SearchNavbarProps) => {
    const{startIndex, searchKey,filterCategory,categories,
        setSearchKey,setFilterCategory,
        filteredPetition, costSearchKey, setCostSearchKey,sortBy, handleSort} = props
    return (
        <div style={{justifyContent:'center', alignItems:'center' , marginTop: "20px"}}>
            <FormControl sx={{m: 1, width: 300}}>
                <TextField id="outlined-basic" label="Search for petition" variant="outlined"
                           value={searchKey} onChange={e => {
                    setSearchKey(e.target.value)
                }}></TextField>
            </FormControl>
            <FormControl sx={{m: 1, width: 300}}>
                <InputLabel>Filter by Category</InputLabel>
                <Select
                    multiple
                    value={filterCategory}
                    onChange={(e: any) => setFilterCategory(e.target.value)}
                >
                    {categories.map((row) => (
                        <MenuItem key={row.id} value={row.id}>
                            <Checkbox checked={filterCategory.indexOf(row.id) > -1}/>
                            {row.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{m: 1, width: 200}}>
                <TextField id="outlined-basic" label="Filter by Cost" variant="outlined"
                           value={costSearchKey} onChange={e => {
                    setCostSearchKey(e.target.value)
                }}></TextField>
            </FormControl>
            <FormControl  sx={{m: 1, width: 100}}>
                <InputLabel>Sort</InputLabel>
                <Select
                    value={sortBy}
                    label="Sort"
                    onChange={handleSort}>
                    <MenuItem value={'CREATED_ASC'}>Oldest to newest</MenuItem>
                    <MenuItem value={'CREATED_DESC'}>Newest to oldest</MenuItem>
                    <MenuItem value={'ALPHABETICAL_ASC'}>Alphabetically by title, A-Z</MenuItem>
                    <MenuItem value={'ALPHABETICAL_DESC'}>Alphabetically by title, Z-A</MenuItem>
                    <MenuItem value={'COST_ASC'}>By cost ascending</MenuItem>
                    <MenuItem value={'COST_DESC'}>By cost descending</MenuItem>
                </Select>
            </FormControl>
            <Button variant="contained" onClick={() => filteredPetition(startIndex)} size="large" sx={{m: 1, height:55}}>
                Search</Button>
        </div>

    )
}

export default SearchNavbar;