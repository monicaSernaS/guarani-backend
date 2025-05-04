import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVacationHome extends Document {
  title: string;
  description?: string;
  city?: string;
  address?: string;
  pricePerNight: number;
  images?: string[];
  available: boolean;
  amenities?: string[];
  owner: Types.ObjectId;
  tourPackages?: Types.ObjectId[];
}

const vacationHomeSchema = new Schema<IVacationHome>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    city: { type: String, trim: true },
    address: { type: String, trim: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    available: { type: Boolean, default: true },
    amenities: [{ type: String }],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tourPackages: [{ type: Schema.Types.ObjectId, ref: 'TourPackage' }]
  },
  { timestamps: true }
);

export default mongoose.model<IVacationHome>('VacationHome', vacationHomeSchema);
