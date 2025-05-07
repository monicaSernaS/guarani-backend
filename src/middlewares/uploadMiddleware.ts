import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: 'vacation_homes',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  }),
});

export const upload = multer({ storage });

