import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigPaths } from './shared/config/app.config';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
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
                entities: [],
                synchronize: true
            }),
            inject: [ConfigService]
        }),
        HealthModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
