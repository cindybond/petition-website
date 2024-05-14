import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Users from "./pages/Users";
import Petitions from "./pages/Petitions";
function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
              <Route path="/users" element={<Users/>}/>
                <Route path="/petitions" element={<Petitions/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;
