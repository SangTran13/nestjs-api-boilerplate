import { Injectable } from '@nestjs/common';

// business logic, data processing, etc.
// post data to db, get data from db, call other services, etc.

@Injectable()
export class HelloService {

    getHello(): string {
        return 'Hello, World!';
    }

    getHelloWithName(name: string): string {
        return `Hello, ${name}!`;
    }
}
