import { ChannelRepository } from './repository/channel.repository';
import { Module } from '@nestjs/common';
import { TopicRepository } from './repository/topic.repository';

@Module({
    providers: [ChannelRepository, TopicRepository]
})
export class ChannelsModule {}
