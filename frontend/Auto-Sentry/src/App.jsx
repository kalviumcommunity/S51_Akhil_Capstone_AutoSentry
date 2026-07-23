import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import Home               from './pages/Home/Home';
import About              from './pages/About/About';
import Services           from './pages/Services/Services';
import Contact            from './pages/Contact/Contact';
import SignUp             from './pages/SignUP/SignupForm';
import SignIN             from './pages/Login/LoginForm';
import Garage             from './pages/Garage/Garage';
import Addnew             from './components/Add New/addnew';
import UpdateVehicle      from './components/Update Vehicle/UpdateVehicle';
import Profile            from './pages/Profile/Profile';
import Settings           from './pages/Settings/Settings';
import Help               from './pages/Help/Help';
import NotFound           from './pages/NotFound/NotFound';
import VehicleServiceHistory from './pages/Service History/VehicleServiceHistory';
import GoogleCalender     from './pages/GoogleCalender/GoogleCalender';
import TaskDashboard      from './pages/Maintenance Tasks/TaskDashboard/TaskDashboard';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Handles the Auth0 post-login redirect.
 * After login, Auth0 returns to the app and appState.returnTo is restored.
 */
const AuthCallback = () => {
  const { isAuthenticated, appState } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && appState?.returnTo) {
      navigate(appState.returnTo, { replace: true });
    }
  }, [isAuthenticated, appState, navigate]);

  return null;
};

function App() {
  return (
    <Router>
      <a href="#main-content" className="skip-nav">Skip to main content</a>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthCallback />
      <main id="main-content">
        <Routes>
          {/* ── PUBLIC routes ── */}
          <Route path="/"          element={<Home />} />
          <Route path="/about"     element={<About />} />
          <Route path="/services"  element={<Services />} />
          <Route path="/contact-us"element={<Contact />} />
          <Route path="/help"      element={<Help />} />
          <Route path="/sign-up"   element={<SignUp />} />
          <Route path="/signin"    element={<SignIN />} />

          {/* ── PROTECTED routes — require Auth0 login ── */}
          <Route path="/garage"    element={<ProtectedRoute><Garage /></ProtectedRoute>} />
          <Route path="/addnew"    element={<ProtectedRoute><Addnew /></ProtectedRoute>} />
          <Route path="/update/:id"element={<ProtectedRoute><UpdateVehicle /></ProtectedRoute>} />
          <Route path="/maintenancetask/:vehicleId" element={<ProtectedRoute><TaskDashboard /></ProtectedRoute>} />
          <Route path="/servicehistory"             element={<ProtectedRoute><VehicleServiceHistory /></ProtectedRoute>} />
          <Route path="/Googlecalender"             element={<ProtectedRoute><GoogleCalender /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
