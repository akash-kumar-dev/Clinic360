import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  email: string;
  password: string;
  role: 'patient';
}

const PatientSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient'], required: true },
});

export default mongoose.model<IPatient>('Patient', PatientSchema); 