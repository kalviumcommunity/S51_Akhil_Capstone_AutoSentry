import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'; 
import About from './pages/About/About';
import Services from './pages/Services/Services';
import Contact from './pages/Contact/Contact';
import SignUp from './pages/SignUP/SignupForm';
import SignIN from './pages/Login/LoginForm'
import Garage from './pages/Garage/Garage';
import Addnew from './components/Add New/addnew'
import UpdateVehicle from './components/Update Vehicle/updateVehicle';
import Garage2 from './pages/Garage/Garage2';


import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VehicleServiceHistory from './pages/Service History/VehicleServiceHistory';
import GoogleCalender from './pages/GoogleCalender/GoogleCalender'
import TaskDashboard from './pages/Maintenance Tasks/TaskDashboard/TaskDashboard';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/signin" element={<SignIN />} />
        <Route path="/garage" element={<Garage />} />
        <Route path='/maintenancetask/:vehicleId' element={<TaskDashboard />} />
        <Route path='/garage2' element={<Garage2 />} />
        <Route path="/addnew" element={<Addnew />} />
        <Route path='/update/:id' element={<UpdateVehicle />}/>
        <Route path='/servicehistory' element={<VehicleServiceHistory />} />
        <Route path='/Googlecalender' element={<GoogleCalender />} />
      </Routes>
    </Router>
  ); 
}

export default App;

