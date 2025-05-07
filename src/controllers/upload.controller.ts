import { Response } from 'express';
import { UploadRequest } from '../types/express';

export const uploadImage = async (req: UploadRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: '❌ No file uploaded' });
    return;
}

  res.status(200).json({
    message: '✅ Image uploaded successfully',
    url: (req.file as any).path, // cloudinary URL
  });
};
