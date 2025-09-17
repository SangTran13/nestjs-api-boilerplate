import { Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard } from "@nestjs/throttler";

// Custom Throttler Guard for login attempts
// Limits the number of login attempts to prevent brute-force attacks
@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {

    protected async getTracker(req: Record<string, any>): Promise<string> {
        const email = req.body?.email || 'anonymous';
        return `login-${email}`;
    }

    // set limit to 5 requests per minute
    protected getRequestLimit(): Promise<number> {
        return Promise.resolve(5);
    }

    // time window is 60 seconds
    protected getTTL(): Promise<number> {
        return Promise.resolve(60 * 1000); // 1 minute in milliseconds
    }

    protected async throwThrottlingException(): Promise<void> {
        throw new ThrottlerException('Too many login attempts. Please try again later.');
    }
}
