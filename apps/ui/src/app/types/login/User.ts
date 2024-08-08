import { UserRole } from './UserRole';

export interface User {
    id: string;

    email: string;

    firstName: string;

    lastName: string;

    role: UserRole;
}
