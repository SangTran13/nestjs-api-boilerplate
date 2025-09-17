import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction): void {
        const { method, originalUrl } = req;
        const userAgent = req.get('user-agent') || '';

        this.logger.log(
            `Incoming Request: ${method} ${originalUrl} - User-Agent: ${userAgent}`);

        req['startTime'] = Date.now();

        res.on('finish', () => {
            const { statusCode } = res;
            const duration = Date.now() - req['startTime'];

            if (statusCode >= 500) {
                this.logger.error(
                    `Response: ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`);
            } else if (statusCode >= 400) {
                this.logger.warn(
                    `Response: ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`);
            } else {
                this.logger.log(
                    `Response: ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`);
            }
        });

        next();

    }
}