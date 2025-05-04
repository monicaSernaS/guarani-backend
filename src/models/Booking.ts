import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  user: Types.ObjectId;
  home: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    home: { type: Schema.Types.ObjectId, ref: 'VacationHome', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export default model<IBooking>('Booking', bookingSchema);
