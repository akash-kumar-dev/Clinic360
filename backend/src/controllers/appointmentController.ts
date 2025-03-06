import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Doctor from '../models/Doctor';
import Patient from '../models/Patient';

export const bookAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { doctorId, patientId, slot } = req.body;

    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    if (!doctor || !patient) {
      throw new Error('Doctor or patient not found');
    }

    // console.log('Doctor availabilitySlots:', doctor.availabilitySlots);
    // const slotIndex = doctor.availabilitySlots.findIndex(s => s.time === slot);
    const slotIndex = doctor.availabilitySlots.findIndex(s => s.time.toISOString() === slot);

    console.log('Slot index:', slotIndex);
//     console.log('Slot:', slot, typeof slot);
// console.log('Availability Slots:', doctor.availabilitySlots.map(s => ({ time: s.time, type: typeof s.time })));

    if (slotIndex === -1 || doctor.availabilitySlots[slotIndex].status === 'booked') {
      throw new Error('Slot not available');
    }

    // Update slot status to booked
    doctor.availabilitySlots[slotIndex].status = 'booked';
    doctor.bookedSlots.push(slot);
    await doctor.save();

    const newAppointment: any = {
      doctorId: doctor._id,
      doctorName: doctor.name,
      date: new Date(slot),
      status: 'scheduled'
    };
    
    patient.appointments.push(newAppointment);
    await patient.save();
    
    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, appointmentId, slot } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const appointmentIndex = patient.appointments.findIndex(
      (app: any) => app._id.toString() === appointmentId
    );

    if (appointmentIndex === -1) {
      throw new Error('Appointment not found');
    }

    patient.appointments[appointmentIndex].status = 'cancelled';
    await patient.save();

    // Find doctor and update slot status back to available
    const doctor = await Doctor.findById(patient.appointments[appointmentIndex].doctorId);
    if (doctor) {
      const slotIndex = doctor.availabilitySlots.findIndex(s => s.time === slot);
      if (slotIndex !== -1) {
        doctor.availabilitySlots[slotIndex].status = 'available';
        doctor.bookedSlots = doctor.bookedSlots.filter(s => s !== slot);
        await doctor.save();
      }
    }

    res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
