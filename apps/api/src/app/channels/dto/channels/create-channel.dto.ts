import { ArrayMaxSize, ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { CreateTopicDto } from '../topics/create-topic.dto';

export class CreateChannelDto {
    @ApiProperty({ example: 'general', description: 'The name of the channel' })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'msg Career Start 2024',
        description: 'Description of the channel'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: ['NODEJS', 'AWS'],
        description: 'Array of topic names associated with the channel'
    })
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one topic must be provided' })
    @ArrayMaxSize(5, { message: 'No more than 5 topics can be associated with a channel' })
    topics?: CreateTopicDto[];
}
