import { Injectable } from '@nestjs/common';
import { HelloService } from 'src/hello/hello.service';

@Injectable()
export class UserService {
    // injecting service from another module
    // hello module must export the service
    // and user module must import the hello module

    constructor(private readonly helloService: HelloService) { }

    getAllUsers() {
        return [
            { id: 1, name: 'Sang Tran Ngoc' },
            { id: 2, name: 'Quy Nguyen Xuan' },
            { id: 3, name: 'Huy Tran Duc' },
            { id: 4, name: 'Huy Dinh Trong' },
            { id: 5, name: 'Dung Nguyen Ngoc' },
        ];
    }

    getUserById(id: number) {
        const users = this.getAllUsers();
        return users.find(user => user.id === id);
    }

    getWelcomeMessage(userId: number) {
        const user = this.getUserById(userId);
        if (!user) {
            return `User with id ${userId} not found.`;
        }
        return this.helloService.getHelloWithName(user.name);
    }
}
