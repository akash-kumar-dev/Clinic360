import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Doctor, { IDoctor } from '../models/Doctor';
import Patient, { IPatient } from '../models/Patient';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role, specialty, location, experience } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'doctor') {
      const newDoctor = new Doctor({ name, email, password: hashedPassword, specialty, location, experience });
      await newDoctor.save();
    } else if (role === 'patient') {
      const newPatient = new Patient({ name, email, password: hashedPassword, role });
      await newPatient.save();
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  try {
    let user: IDoctor | IPatient | null;

    if (role === 'doctor') {
      user = await Doctor.findOne({ email }) as IDoctor | null;
    } else if (role === 'patient') {
      user = await Patient.findOne({ email }) as IPatient | null;
    } else {
      res.status(400).json({ message: 'Invalid role specified' });
      return;
    }

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const setAvailabilitySlots = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { availabilitySlots } = req.body;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    doctor.availabilitySlots = availabilitySlots;
    await doctor.save();

    res.status(200).json({ message: 'Availability slots updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating availability slots', error });
  }
};

export const getDoctorProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    // Exclude the password from the response
    const { password, ...doctorProfile } = doctor.toObject();
    res.status(200).json(doctorProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor profile', error });
  }
};

export const getPatientProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    // Exclude the password from the response
    const { password, ...patientProfile } = patient.toObject();
    res.status(200).json(patientProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient profile', error });
  }
};

export const getAllDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await Doctor.find();
    // Exclude passwords from the response
    const doctorProfiles = doctors.map(({ password, ...doctorProfile }) => doctorProfile);
    res.status(200).json(doctorProfiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
};
