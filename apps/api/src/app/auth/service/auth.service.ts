import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { User } from '../../users/domain/user.domain';
import { UserService } from '../../users/service/user.service';
import { JWTPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string) {
        console.log('EMAIL AND PASSWORD');
        const user = await this.userService.getByEmail(email);

        console.log('USER FROM AUTH SERVICE', user);
        if (user && (await bcrypt.compare(password, user.password))) {
            delete user.password;

            return user;
        }
        return null;
    }

    @ApiOkResponse({ description: 'Login user' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
    async login(user: User) {
        const payload: JWTPayload = {
            email: user.email,
            sub: user.id,
            role: user.role
        };
        return {
            user: { ...user },
            accessToken: this.jwtService.sign(payload)
        };
    }
}
