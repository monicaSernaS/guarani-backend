import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITourPackage extends Document {
  title: string;
  description?: string;
  price: number;
  available: boolean;
  images?: string[];
  property?: Types.ObjectId;
  createdBy: Types.ObjectId;
}

const tourPackageSchema = new Schema<ITourPackage>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    property: { type: Schema.Types.ObjectId, ref: 'VacationHome', required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model<ITourPackage>('TourPackage', tourPackageSchema);
