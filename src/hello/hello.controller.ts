import { Controller, Get, Param, Query } from '@nestjs/common';
import { HelloService } from './hello.service';

// incoming requests and return responses
// get, post, put, delete, patch, etc.

// localhost:3000/hello

@Controller('hello')
export class HelloController {
    // dependency injection

    constructor(private readonly helloService: HelloService) {

    }

    // GET /hello/first-route
    @Get('first-route')
    getHello(): string {
        return this.helloService.getHello();
    }

    // GET /hello/name/:name
    @Get('name/:name')
    getHelloWithName(@Param('name') name: string): string {
        return this.helloService.getHelloWithName(name);
    }

    // GET /hello/query?name=yourname
    @Get('query')
    getHelloWithQuery(@Query('name') name: string): string {
        return this.helloService.getHelloWithName(name);
    }

}
