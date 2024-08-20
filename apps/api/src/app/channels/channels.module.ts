import { Channel } from './domain/channel.entity';
import { ChannelController } from './controllers/channels/channel.controller';
import { ChannelRepository } from './repository/channel.repository';
import { ChannelService } from './services/channels/channel.service';
import { forwardRef, Module } from '@nestjs/common';
import { Topic } from './domain/topic.entity';
import { TopicController } from './controllers/topics/topic.controller';
import { TopicRepository } from './repository/topics/topic.repository';
import { TopicService } from './services/topics/topic.service';
import { TransactionManager } from '../shared/services/transaction.manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/user.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel, Topic]),
        UsersModule,
        forwardRef(() => MessagesModule)
    ],
    providers: [
        ChannelService,
        TopicService,
        ChannelRepository,
        TopicRepository,
        TransactionManager
    ],
    exports: [ChannelService, TopicService, ChannelRepository, TopicRepository],
    controllers: [ChannelController, TopicController]
})
export class ChannelsModule {}
