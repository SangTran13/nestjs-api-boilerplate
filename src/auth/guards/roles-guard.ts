import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../entities/user.entity";
import { ROLES_KEY } from "../decorators/roles.decorators";



@Injectable()
export class RolesGuard implements CanActivate {
    // Inject Reflector to access metadata set by the Roles decorator
    constructor(private reflector: Reflector) { }

    // Implement the canActivate method to determine if the request should proceed

    canActivate(context: ExecutionContext): boolean {
        // Get the required roles from the metadata
        // retrieve roles metadata set by the Roles decorator
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [
                context.getHandler(), // method-level roles
                context.getClass(), // class-level roles
            ]
        );

        // If no roles are required, allow access
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        // Get the user from the request
        const { user } = context.switchToHttp().getRequest();

        // If no user is found, deny access
        if (!user) {
            throw new ForbiddenException('Access denied: User not authenticated');
        }

        const hasRequiredRole = requiredRoles.some((role) => user.role === role);

        if (!hasRequiredRole) {
            throw new ForbiddenException('Access denied: Insufficient permissions');
        }

        return true; // User has one of the required roles, allow access

    }
}