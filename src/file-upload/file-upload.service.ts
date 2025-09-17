import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { File } from './entities/file.entity';

@Injectable()
export class FileUploadService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
        private readonly cloudinaryService: CloudinaryService
    ) { }


    async uploadFile(file: Express.Multer.File, description: string | undefined, uploader: User): Promise<File> {
        const uploadResult = await this.cloudinaryService.uploadFile(file);

        const newFile = this.fileRepository.create({
            originalName: file.originalname,
            mimeType: file.mimetype,
            url: uploadResult.secure_url,
            size: file.size,
            publicId: uploadResult.public_id,
            description,
            uploader
        });

        return this.fileRepository.save(newFile);
    }

    async findAll(): Promise<File[]> {
        return this.fileRepository.find({
            relations: ['uploader'],
            order: { createdAt: 'DESC' }
        });
    }

    async remove(id: string): Promise<void> {
        const file = await this.fileRepository.findOne({
            where: { id },
        });

        if (!file) {
            throw new NotFoundException('File not found');
        }

        await this.cloudinaryService.deleteFile(file.publicId, file.mimeType);

        await this.fileRepository.remove(file);
    }
}
