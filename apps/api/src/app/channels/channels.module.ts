import { ChannelController } from './controllers/channel.controller';
import { ChannelRepository } from './repository/channel.repository';
import { ChannelService } from './services/channel.service';
import { Module } from '@nestjs/common';
import { TopicRepository } from './repository/topic.repository';
import { TopicService } from './services/topic.service';

@Module({
    providers: [ChannelService, TopicService, ChannelRepository, TopicRepository],
    controllers: [ChannelController]
})
export class ChannelsModule {}
