import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDTO {
    @ApiProperty({ description: 'The text content of the message' })
    @IsNotEmpty()
    @IsString()
    content: string;
}
