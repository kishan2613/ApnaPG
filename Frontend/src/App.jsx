import { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Home from './pages/Home';
import Show from './pages/Show';
import Edit from './pages/Edit';
import Navbar from './components/common/Navbar';
import AddListing from './pages/Addlisting';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './pages/ProtectedRoute';



function App() {

  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    // Fetch current user when app loads
    fetch("http://localhost:8080/current-user", {
      credentials: "include", // important to send cookies/session
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrUser(data.user);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Router>
     <Navbar currUser={currUser} setCurrUser={setCurrUser} />           
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listing/:id/edit" element={ 
            <ProtectedRoute currUser={currUser}>
              <Edit/>
            </ProtectedRoute>} /> 
          <Route path="/listing/:id" element={<Show />} />          
          <Route path="/new" element={<AddListing />} />    
          <Route path="/login" element={<Login />} />    
          <Route path="/signup" element={<Signup />} />    
        </Routes>
    </Router>
  );
}

export default App;