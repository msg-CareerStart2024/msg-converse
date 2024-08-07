import { Role } from '../../users/enums/role.enum';

export interface JWTPayload {
    email: string;
    sub: {
        userId: string;
        role: Role;
    };
}
