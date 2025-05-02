import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import vacationHomeRoutes from './routes/vacationHome.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/vacation-homes', vacationHomeRoutes);

// Conexión a MongoDB y levantamiento del servidor
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {   
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT} 🟢`));
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB');
  });
