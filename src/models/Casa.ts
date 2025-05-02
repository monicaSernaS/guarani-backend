import mongoose, { Schema, Document } from 'mongoose';

export interface ICasa extends Document {
  titulo: string;
  descripcion?: string;
  ciudad?: string;
  direccion?: string;
  precioPorNoche: number;
  imagenes?: string[];
  disponible: boolean;
  servicios?: string[];
}

const casaSchema = new Schema<ICasa>({
  titulo: { type: String, required: true },
  descripcion: String,
  ciudad: String,
  direccion: String,
  precioPorNoche: { type: Number, required: true },
  imagenes: [String],
  disponible: { type: Boolean, default: true },
  servicios: [String]
}, { timestamps: true });

export default mongoose.model<ICasa>('Casa', casaSchema);
