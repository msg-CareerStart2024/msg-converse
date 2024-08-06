import { ApiProperty } from '@nestjs/swagger';

export class TopicDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;
}
