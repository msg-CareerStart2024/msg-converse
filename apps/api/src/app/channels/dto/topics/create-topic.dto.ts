import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
    @ApiProperty({ example: 'GAMING', description: 'The name of the topic' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
