import express from 'express';
import { registerUser, loginUser, setAvailabilitySlots } from '../controllers/userController';

const router = express.Router();

// Patient routes
router.post('/register/patient', registerUser);
router.post('/login/patient', loginUser);

// Doctor routes
router.post('/register/doctor', registerUser);
router.post('/login/doctor', loginUser);
router.post('/doctors/:id/availability', setAvailabilitySlots);

export default router;
