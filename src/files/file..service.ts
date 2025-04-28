import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from 'src/common/provider/cloudinary.provider';

@Injectable()
export class FileService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return await cloudinary.uploader.upload(file.path, {
      folder: 'my-portfolio-images',
    });
  }
}
