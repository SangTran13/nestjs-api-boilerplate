import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../entities/user.entity";

// Custom Roles decorator to specify required roles for route handlers
// unique identifier for the roles metadata

export const ROLES_KEY = 'roles';

// Roles decorator factory function
// role guard will later reads this metadata to enforce role-based access control

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
