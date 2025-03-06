import mongoose, { Document, Schema } from 'mongoose';

export interface ISlot {
  time: Date;  // Changed to Date type
  status: 'available' | 'booked';
}

export interface IDoctor extends Document {
  name: string;
  email: string;
  password: string;
  specialty: string;
  location: {
    city: string;
    state: string;
  };
  experience: number;
  availabilitySlots: ISlot[];
  bookedSlots: Date[];  // Changed to Date type
}

const DoctorSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  experience: { type: Number, required: true },
  availabilitySlots: [{
    time: { type: Date, required: true },  // Changed to Date type
    status: {
      type: String,
      enum: ['available', 'booked'],
      default: 'available'
    }
  }],
  bookedSlots: [{ type: Date }]  // Changed to Date type
});

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);