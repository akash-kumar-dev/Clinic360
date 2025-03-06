import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import DoctorsList from './components/DoctorsList';
import DoctorProfile from './components/DoctorProfile';
import PatientProfile from './components/PatientProfile';
import Landing from './components/Landing';
import EditDoctorProfile from './components/EditDoctorProfile';
import SetAvailability from './components/SetAvailability';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<DoctorsList />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/patient/:id" element={<PatientProfile />} />
        <Route path="/doctor/edit/:id" element={<EditDoctorProfile />} />
        <Route path="/doctor/availability/:id" element={<SetAvailability />} />
      </Routes>
    </Router>
  );
}

export default App;