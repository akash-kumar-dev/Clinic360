import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  specialty: string;
  location: {
    city: string;
    state: string;
  };
  experience: number; // in years
  availabilitySlots: string[]; // e.g., ["2023-03-01T10:00:00Z", "2023-03-01T11:00:00Z"]
}

const DoctorSchema: Schema = new Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  experience: { type: Number, required: true },
  availabilitySlots: { type: [String], required: true },
});

export default mongoose.model<IDoctor>('Doctor', DoctorSchema); 