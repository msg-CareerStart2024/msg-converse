import { ConfigModule, ConfigService } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtGuard } from './guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt-auth.strategy';
import { LocalStrategy } from './strategies/local-auth.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/user.module';

@Module({
    imports: [
        PassportModule,
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '14400s' }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [
        AuthService,
        JwtStrategy,
        LocalStrategy,
        {
            provide: APP_GUARD,
            useClass: JwtGuard
        }
    ],
    exports: [AuthService, JwtModule],
    controllers: [AuthController]
})
export class AuthModule {}
