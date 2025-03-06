import express from 'express';
import { bookAppointment, cancelAppointment } from '../controllers/appointmentController';

const router = express.Router();

router.post('/book', bookAppointment);
router.post('/cancel', cancelAppointment);

export default router;
