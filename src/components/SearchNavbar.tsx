import {Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import React from "react";


interface SearchNavbarProps {
    searchKey: string,
    setSearchKey: React.Dispatch<React.SetStateAction<string>>,
    filterCategory:number[],
    setFilterCategory:React.Dispatch<React.SetStateAction<number[]>>,
    categories:Categories[],
    filteredPetition:()=>void
    costSearchKey: string,
    setCostSearchKey:React.Dispatch<React.SetStateAction<string>>
}
const SearchNavbar = (props:SearchNavbarProps) => {
    const{ searchKey,filterCategory,categories,
        setSearchKey,setFilterCategory,
        filteredPetition, costSearchKey, setCostSearchKey } = props
    return (
        <div style={{marginTop: "20px"}}>
            <FormControl sx={{m: 1, width: 300}}>
                <TextField id="outlined-basic" label="Search for petition" variant="outlined" size="small"
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
                        <MenuItem key={row.categoryId} value={row.categoryId}>
                            <Checkbox checked={filterCategory.indexOf(row.categoryId) > -1}/>
                            {row.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{m: 1, width: 200}}>
                <TextField id="outlined-basic" label="Filter by Cost" variant="outlined" size="small"
                           value={costSearchKey} onChange={e => {
                    setCostSearchKey(e.target.value)
                }}></TextField>
            </FormControl>
            <Button variant="outlined" onClick={filteredPetition} sx={{m: 1}}>Search</Button>
        </div>

    )
}

export default SearchNavbar;