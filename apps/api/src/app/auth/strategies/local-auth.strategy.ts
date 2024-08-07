import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(username: string, password: string) {
        console.log('EMAIL AND PASSWORD', username, password);
        const user = await this.authService.validateUser(username, password);
        console.log('USER FROM LOCAL STRATEGY', user);
        if (!user) throw new UnauthorizedException('Invalid user credentials');

        return user;
    }
}
