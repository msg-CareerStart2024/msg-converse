import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../../users/domain/user.domain';
import { UserService } from '../../users/service/user.service';
import { JWTPayload } from '../dto/jwt-payload.dto';
import { LoginResponse } from '../dto/login-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.getByEmail(email);
        const isPasswordValid = user && (await bcrypt.compare(password, user.password));

        return isPasswordValid ? { ...user, password: undefined } : null;
    }

    async login(user: User): Promise<LoginResponse> {
        const payload: JWTPayload = {
            email: user.email,
            sub: user.id,
            role: user.role
        };
        return {
            user,
            accessToken: this.jwtService.sign(payload)
        };
    }
}
