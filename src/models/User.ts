import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _id: Types.ObjectId; 
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'host' | 'user';
  phone?: string;
  address?: string;
  comparePassword: (candidate: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6 },
  role:      { type: String, enum: ['admin', 'host', 'user'], default: 'user' },
  phone:     { type: String },
  address:   { type: String }
}, { timestamps: true });

// Hashea la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

// Compara contraseñas
userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return await bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
