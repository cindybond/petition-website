import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Petitions from "./pages/Petitions";
import Home from "./pages/Home";
import Login from './pages/Login';
import Register from './pages/Register';
import PetitionDetails from './pages/PetitionDetails';
import User from "./pages/Profile";
import Profile from "./pages/Profile";
import MyPetitions from "./pages/MyPetitions";
import CreatePetition from "./pages/CreatePetition";
import EditPetition from "./pages/EditPetition";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
              <Route path="" element={<Petitions/>}/>
                <Route path="/petitions" element={<Petitions/>}/>
                <Route path="/petitions/:id" element={<PetitionDetails/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/myPetitions" element={<MyPetitions />}/>
                <Route path="/create" element={<CreatePetition />}/>
                <Route path="/edit/:petitionId" element={<EditPetition />}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;
