import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './domain/message.domain';
import { MessageRepository } from './repository/message.repository';
import { MessageService } from './service/message.service';
import { MessageMapper } from './mapper/message.mapper';
import { MessagesController } from './controller/message.controller';
import { ChannelsModule } from '../channels/channels.module';
import { UsersModule } from '../users/user.module';
import { MessageGateway } from './gateway/message.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        ChannelsModule,
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
    providers: [MessageMapper, MessageRepository, MessageService, MessageGateway],
    controllers: [MessagesController]
})
export class MessagesModule {}
