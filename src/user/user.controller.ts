import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    // GET /user
    @Get()
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    // GET /user/:id
    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUserById(id);
    }

    // GET /user/:id/welcome
    @Get(':id/welcome')
    getWelcomeMessage(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getWelcomeMessage(id);
    }
}
