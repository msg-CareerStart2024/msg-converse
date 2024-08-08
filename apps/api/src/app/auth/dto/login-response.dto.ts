import { User } from '../../users/domain/user.domain';

export interface LoginResponse {
    user: User;
    accessToken: string;
}
