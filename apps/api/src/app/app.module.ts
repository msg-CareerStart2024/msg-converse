import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ChannelsModule } from './channels/channels.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { AppConfigPaths } from './shared/config/app.config';
import { UsersModule } from './users/user.module';
import { MessagesModule } from './messages/messages.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env`,
            validationSchema: Joi.object({
                [AppConfigPaths.database.host]: Joi.string().required(),
                [AppConfigPaths.database.port]: Joi.string().required(),
                [AppConfigPaths.database.username]: Joi.string().required(),
                [AppConfigPaths.database.password]: Joi.string().required(),
                [AppConfigPaths.database.database]: Joi.string().required()
            })
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get(AppConfigPaths.database.host),
                port: +configService.get(AppConfigPaths.database.port),
                username: configService.get(AppConfigPaths.database.username),
                password: configService.get(AppConfigPaths.database.password),
                database: configService.get(AppConfigPaths.database.database),
                autoLoadEntities: true,
                synchronize: true
            }),
            inject: [ConfigService]
        }),
        MessagesModule,
        ChannelsModule,
        HealthModule,
        UsersModule,
        AuthModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        }
    ]
})
export class AppModule {}
