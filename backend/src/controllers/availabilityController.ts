import { Request, Response } from 'express';
import Doctor from '../models/Doctor';

export const addAvailabilitySlot = async (req: Request, res: Response): Promise<void> => {
  const { doctorId, slot } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    doctor.availabilitySlots.push(slot);
    await doctor.save();

    res.status(200).json({ message: 'Availability slot added successfully', slots: doctor.availabilitySlots });
  } catch (error) {
    res.status(500).json({ message: 'Error adding availability slot', error });
  }
};

export const getAvailabilitySlots = async (req: Request, res: Response): Promise<void> => {
  const { doctorId } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    res.status(200).json({ slots: doctor.availabilitySlots });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching availability slots', error });
  }
};
