import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class RegisterDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    @MaxLength(50, { message: 'Name can no longer than 50 characters long' })
    name: string;

    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsNotEmpty({ message: 'Please confirm your password' })
    confirmPassword: string;

}