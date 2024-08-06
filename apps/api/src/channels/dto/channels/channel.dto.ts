import { ApiProperty } from '@nestjs/swagger';
import { TopicDto } from '../topics/topic.dto';

export class ChannelDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ required: false })
    description?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ type: [TopicDto] })
    topics: TopicDto[];
}
