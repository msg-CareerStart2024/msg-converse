import { Role } from '../../users/enums/role.enum';

export interface JWTPayload {
    email: string;
    role: Role;
    sub: string;
}
