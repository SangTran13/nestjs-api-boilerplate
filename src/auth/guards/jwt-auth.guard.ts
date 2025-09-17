import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// Custom JWT Auth Guard using Passport's JWT strategy
// This guard can be applied to routes to protect them and ensure that only authenticated users can access them.

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
