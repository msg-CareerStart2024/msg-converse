import { UserRole } from './UserRole.enum';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}
