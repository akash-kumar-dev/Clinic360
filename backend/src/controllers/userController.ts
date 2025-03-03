import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role, specialty, location, experience } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    if (role === 'doctor') {
      const newDoctor = new Doctor({ name, specialty, location, experience });
      await newDoctor.save();
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
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
