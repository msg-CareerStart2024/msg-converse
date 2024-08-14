import { User } from './User.types';

export interface AuthState {
    user?: User;
    accessToken?: string;
}
