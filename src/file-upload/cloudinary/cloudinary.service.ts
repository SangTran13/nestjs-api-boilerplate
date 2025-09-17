import { Inject, Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import * as streamifier from 'streamifier';


@Injectable()
export class CloudinaryService {
    constructor(
        @Inject('CLOUDINARY')
        private readonly cloudinary: any
    ) { }

    async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
        let resourceType: 'image' | 'video' | 'raw' = 'raw';
        if (file.mimetype.startsWith('image/')) resourceType = 'image';
        else if (file.mimetype.startsWith('video/')) resourceType = 'video';

        return new Promise<UploadApiResponse>((resolve, reject) => {
            streamifier.createReadStream(file.buffer).pipe(
                this.cloudinary.uploader.upload_stream({
                    folder: 'nestjs-api-boilerplate',
                    resource_type: resourceType
                }, (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                    if (error) return reject(error);
                    resolve(result);
                })
            );
        });
    }

    async deleteFile(publicId: string, mimeType: string): Promise<void> {
        let resourceType: 'image' | 'video' | 'raw' = 'raw';
        if (mimeType.startsWith('image/')) resourceType = 'image';
        else if (mimeType.startsWith('video/')) resourceType = 'video';

        await this.cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
    }
}