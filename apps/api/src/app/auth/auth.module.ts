import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../users/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './strategies/jwt-auth.strategy';
import { LocalStrategy } from './strategies/local-auth.strategy';

@Module({
    imports: [
        PassportModule,
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '3600s' }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [
        AuthService,
        JwtStrategy,
        LocalStrategy
        // {
        //     provide: APP_GUARD,
        //     useClass: JwtGuard
        // }
    ],
    exports: [AuthService, JwtModule],
    controllers: [AuthController]
})
export class AuthModule {}
