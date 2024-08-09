import { User } from './User';

export interface AuthState {
    user?: User;
    accessToken?: string;
}
