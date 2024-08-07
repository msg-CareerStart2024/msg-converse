import { ApiProperty } from '@nestjs/swagger';
import { TopicDto } from '../topics/topic.dto';

export class ChannelDto {
    @ApiProperty({
        description: 'The unique identifier of the channel',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @ApiProperty({
        description: 'The name of the channel',
        example: 'msg Career Start 2024',
        minLength: 1,
        maxLength: 100,
    })
    name: string;

    @ApiProperty({
        description: 'A brief description of the channel',
        example: 'Just a description',
        required: false,
        nullable: true,
    })
    description?: string;

    @ApiProperty({
        description: 'The date and time when the channel was created',
        example: '2024-08-15T10:30:00Z',
        type: Date,
    })
    createdAt: Date;

    @ApiProperty({
        description: 'The list of topics associated with this channel',
        type: [TopicDto],
        isArray: true,
    })
    topics: TopicDto[];
}
