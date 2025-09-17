import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePostDto {

    @IsOptional()
    @IsNotEmpty({ message: 'Title should not be empty' })
    @IsString({ message: 'Title must be a string' })
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    @MaxLength(50, { message: 'Title must be at most 50 characters long' })
    title?: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Content should not be empty' })
    @IsString({ message: 'Content must be a string' })
    @MinLength(5, { message: 'Content must be at least 5 characters long' })
    content?: string;
}