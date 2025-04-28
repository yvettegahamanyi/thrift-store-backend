import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file..service';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('files')
export class FileController {
  constructor(private readonly uploadService: FileService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const uploadedImage = await this.uploadService.uploadImage(file);
    return { url: uploadedImage.secure_url };
  }
}
