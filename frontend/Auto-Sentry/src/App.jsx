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
import UpdateVehicle from './components/Update Vehicle/UpdateVehicle';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Help from './pages/Help/Help';
import NotFound from './pages/NotFound/NotFound';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VehicleServiceHistory from './pages/Service History/VehicleServiceHistory';
import GoogleCalender from './pages/GoogleCalender/GoogleCalender'
import TaskDashboard from './pages/Maintenance Tasks/TaskDashboard/TaskDashboard';


function App() {
  return (
    <Router>
      <a href="#main-content" className="skip-nav">Skip to main content</a>
      <Navbar />
      <ToastContainer />
      <main id="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/signin" element={<SignIN />} />
        <Route path="/garage" element={<Garage />} />
        <Route path='/maintenancetask/:vehicleId' element={<TaskDashboard />} />
        <Route path="/addnew" element={<Addnew />} />
        <Route path='/update/:id' element={<UpdateVehicle />}/>
        <Route path='/servicehistory' element={<VehicleServiceHistory />} />
        <Route path='/Googlecalender' element={<GoogleCalender />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </main>
    </Router>
  ); 
}

export default App;

