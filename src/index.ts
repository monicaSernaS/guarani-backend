import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vacationHomeRoutes from './routes/vacationHome.routes';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/vacation-homes', vacationHomeRoutes);

// Conexión a la base de datos y arranque del servidor
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT} 🟢`));
  })
  .catch((err) => {
    console.error('❌ Application failed to start due to DB connection error');
    process.exit(1); // Cierra el proceso si la DB falla
  });
