import express from 'express';
import { registerUser, loginUser, setAvailabilitySlots, getDoctorProfile, getPatientProfile, getAllDoctors } from '../controllers/userController';

const router = express.Router();

// Patient routes
router.post('/register/patient', registerUser);
router.post('/login/patient', loginUser);
router.get('/patient/:id', getPatientProfile);

// Doctor routes
router.post('/register/doctor', registerUser);
router.post('/login/doctor', loginUser);
router.get('/doctor/:id', getDoctorProfile);
router.get('/doctors', getAllDoctors);
router.post('/doctors/:id/availability', setAvailabilitySlots);

export default router;
