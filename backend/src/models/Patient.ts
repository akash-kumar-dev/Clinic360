import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment {
  doctorId: mongoose.Types.ObjectId;
  doctorName: string;
  date: Date;
  status: 'scheduled' | 'cancelled';
}

export interface IPatient extends Document {
  name: string;
  email: string;
  password: string;
  role: 'patient';
  appointments: IAppointment[];
}

const PatientSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient'], required: true },
  appointments: [{
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    doctorName: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'cancelled'], default: 'scheduled' }
  }]
});

export default mongoose.model<IPatient>('Patient', PatientSchema);