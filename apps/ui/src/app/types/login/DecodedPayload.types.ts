import { UserRole } from './UserRole.enum';

export interface DecodedPayload {
    email: string;
    role: UserRole;
    sub: string;
    iat: number;
    exp: number;
}
