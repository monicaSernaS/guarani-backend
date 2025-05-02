import mongoose, { Schema, Document } from 'mongoose';

export interface IVacationHome extends Document {
  title: string;
  description?: string;
  city?: string;
  address?: string;
  pricePerNight: number;
  images?: string[];
  available: boolean;
  amenities?: string[];
}

const vacationHomeSchema = new Schema<IVacationHome>({
  title: { type: String, required: true },
  description: String,
  city: String,
  address: String,
  pricePerNight: { type: Number, required: true },
  images: [String],
  available: { type: Boolean, default: true },
  amenities: [String]
}, { timestamps: true });

export default mongoose.model<IVacationHome>('VacationHome', vacationHomeSchema);
