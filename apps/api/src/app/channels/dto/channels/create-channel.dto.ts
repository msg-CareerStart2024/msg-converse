import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsOptional,
    IsString,
    MaxLength
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { CreateTopicDto } from '../topics/create-topic.dto';
import { Transform } from 'class-transformer';

export class CreateChannelDto {
    @ApiProperty({ example: 'msg Career Start 2024', description: 'The name of the channel' })
    @IsString()
    @MaxLength(50)
    @Transform(({ value }) => value?.trim())
    name: string;

    @ApiProperty({
        example: 'Fullstack developer factory',
        description: 'Description of the channel'
    })
    @IsString()
    @IsOptional()
    @MaxLength(250)
    @Transform(({ value }) => value?.trim())
    description?: string;

    @ApiProperty({
        example: [{ name: 'NODEJS' }, { name: 'AWS' }],
        description: 'Array of topic names associated with the channel'
    })
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one topic must be provided' })
    @ArrayMaxSize(5, { message: 'No more than 5 topics can be associated with a channel' })
    topics?: CreateTopicDto[];
}
