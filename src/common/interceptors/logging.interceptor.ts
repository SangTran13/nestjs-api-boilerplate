import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

// LoggingInterceptor to log details of incoming requests and outgoing responses
@Injectable()

export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, query, params } = request;
        const userAgent = request.get('user-agent') || '';
        const userId = request?.user?.id || 'Guest';

        this.logger.log(
            `Incoming Request: ${method} ${url} 
            | User: ${userId} 
            | User-Agent: ${userAgent} 
            | Body: ${JSON.stringify(body)} 
            | Query: ${JSON.stringify(query)} 
            | Params: ${JSON.stringify(params)}`);

        const startTime = Date.now();

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const endTime = Date.now();
                    const duration = endTime - startTime;
                    this.logger.log(
                        `Response for ${method} ${url} 
                        | Duration: ${duration}ms`);
                },
                error: (err) => {
                    const endTime = Date.now();
                    const duration = endTime - startTime;
                    this.logger.error(
                        `Error for ${method} ${url} 
                        | Duration: ${duration}ms 
                        | Error: ${err.message}`);
                }
            })
        )
    }
}
