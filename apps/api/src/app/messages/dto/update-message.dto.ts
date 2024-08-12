import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateMessageDTO {
    @ApiProperty({ description: 'The text content of the message' })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({ description: 'The pinned status of the message' })
    @IsBoolean()
    isPinned: boolean;
}
