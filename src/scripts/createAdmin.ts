// Carga primero las variables de entorno
import dotenv from 'dotenv';
dotenv.config();

// Luego importa todo lo demás
import mongoose from 'mongoose';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  const existing = await User.findOne({ email: 'admin@example.com' });
  if (existing) {
    console.log('⚠️ Admin ya existe. Usa /login.');
    return mongoose.disconnect();
  }

  const admin = new User({
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    phone: '123456789',
    address: 'Admin HQ'
  });

  await admin.save();

  const token = generateToken(admin._id.toString(), admin.role);
  console.log('✅ Super Admin creado con éxito:');
  console.log('🪪 Email: admin@example.com');
  console.log('🔐 Password: admin123');
  console.log('🔐 Token:', token);

  await mongoose.disconnect();
};

// Solo ejecuta si no estás en producción
if (process.env.NODE_ENV !== 'production') {
  createAdmin();
}
