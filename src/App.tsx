import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Petitions from "./pages/Petitions";
import Home from "./pages/Home";
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
              <Route path="" element={<Home/>}/>
                <Route path="/petitions" element={<Petitions/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;
