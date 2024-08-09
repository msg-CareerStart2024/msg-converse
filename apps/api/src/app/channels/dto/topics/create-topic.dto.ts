import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateTopicDto {
    @ApiProperty({ example: 'GAMING', description: 'The name of the topic' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => {
        value.toUpperCase();
        value.trim();
    })
    name: string;
}
