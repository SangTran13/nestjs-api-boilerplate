import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

// Data Transfer Object for user login
export class LoginDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}
