import { UserRole } from './UserRole';

export interface DecodedPayload {
    email: string;
    role: UserRole;
    sub: string;
    iat: number;
    exp: number;
}
