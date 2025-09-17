import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorators';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from './guards/roles-guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register-admin')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async registerAdmin(@Body() registerDto: RegisterDto) {
        return this.authService.createAdmin(registerDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@CurrentUser() user: any) {
        const { password, ...safeUser } = user;
        return safeUser;
    }

    @UseGuards(JwtAuthGuard)
    @Post('refresh-token')
    async refreshToken(@Body('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(refreshToken);
    }

}
