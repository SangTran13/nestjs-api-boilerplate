import { Module } from "@nestjs/common";
import { CloudinaryProvider } from "./cloudinary.provider";
import { CloudinaryService } from "./cloudinary.service";

// Module to encapsulate Cloudinary integration
@Module({
    providers: [
        CloudinaryProvider,
        CloudinaryService
    ],
    exports: [CloudinaryService]
})

export class CloudinaryModule { }
