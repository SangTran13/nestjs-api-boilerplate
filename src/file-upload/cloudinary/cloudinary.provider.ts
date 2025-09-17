import { v2 as cloudinary } from 'cloudinary';

// Cloudinary provider to configure and provide the Cloudinary instance
export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: () => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        return cloudinary;
    }
};
