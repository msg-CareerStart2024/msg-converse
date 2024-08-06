import { ApiProperty } from '@nestjs/swagger';

export class TopicDto {
    @ApiProperty({
        description: 'The unique identifier of the topic',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @ApiProperty({
        description: 'The name of the topic',
        example: 'GAMING',
        minLength: 2,
        maxLength: 50,
    })
    name: string;
}
