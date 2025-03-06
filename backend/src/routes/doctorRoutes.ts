import express from 'express';
import { addAvailabilitySlot, getAvailabilitySlots } from '../controllers/availabilityController';

const router = express.Router();

router.post('/availability', addAvailabilitySlot);
router.get('/availability/:doctorId', getAvailabilitySlots);

export default router;
