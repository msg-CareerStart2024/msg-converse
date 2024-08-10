import { Channel } from './domain/channel.entity';
import { ChannelController } from './controllers/channel.controller';
import { ChannelRepository } from './repository/channel.repository';
import { ChannelService } from './services/channels/channel.service';
import { Module } from '@nestjs/common';
import { Topic } from './domain/topic.entity';
import { TopicRepository } from './repository/topics/topic.repository';
import { TopicService } from './services/topics/topic.service';
import { TransactionManager } from '../shared/services/transaction.manager';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Channel, Topic])],
    providers: [
        ChannelService,
        TopicService,
        ChannelRepository,
        TopicRepository,
        TransactionManager
    ],
    exports: [ChannelService, TopicService, ChannelRepository, TopicRepository],
    controllers: [ChannelController]
})
export class ChannelsModule {}
