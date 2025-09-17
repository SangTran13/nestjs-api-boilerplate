import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEventsService } from 'src/events/user-events.service';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        private readonly userEventService: UserEventsService,
    ) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: registerDto.email }
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        if (registerDto.password !== registerDto.confirmPassword) {
            throw new ConflictException('Password and Confirm Password do not match');
        }

        const hashedPassword = await this.hashPassword(registerDto.password);
        const newUser = this.usersRepository.create({
            email: registerDto.email,
            name: registerDto.name,
            password: hashedPassword,
            role: UserRole.USER,
        });

        const savedUser = await this.usersRepository.save(newUser);
        const { password, ...result } = savedUser; // Exclude password from the returned user object

        return {
            message: 'User registered successfully',
            user: result,
        }
    }

    async createAdmin(registerDto: RegisterDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: registerDto.email }
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        if (registerDto.password !== registerDto.confirmPassword) {
            throw new ConflictException('Password and Confirm Password do not match');
        }

        const hashedPassword = await this.hashPassword(registerDto.password);
        const newUser = this.usersRepository.create({
            email: registerDto.email,
            name: registerDto.name,
            password: hashedPassword,
            role: UserRole.ADMIN,
        });
        await this.usersRepository.save(newUser);

        this.userEventService.emitUserRegistered(newUser);

        const { password, ...result } = newUser; // Exclude password from the returned user object

        return {
            message: 'Admin user created successfully',
            user: result,
        }
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersRepository.findOne({
            where: { email: loginDto.email }
        });

        if (!user || !(await this.verifyPassword(loginDto.password, user.password))) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // generate and return a JWT or session here in a real application

        const tokens = this.generateTokens(user);

        const { password, ...result } = user; // Exclude password from the returned user object
        return {
            message: 'Login successful',
            user: result,
            tokens,
        }
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
            if (!user) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const tokens = this.generateTokens(user);
            return {
                message: 'Tokens refreshed successfully',
                tokens,
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async getUserById(id: number) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const { password, ...result } = user; // Exclude password from the returned user object

        return result;
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, hashedPassword);
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    private generateTokens(user: User) {
        return {
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user),
        };
    }

    private generateAccessToken(user: User): string {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
        }

        return this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    }

    private generateRefreshToken(user: User): string {
        const payload = {
            sub: user.id,
        }

        return this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        });
    }
}
