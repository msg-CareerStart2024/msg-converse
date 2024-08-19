import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from '../../users/dto/user.dto';

export class MessageDTO {
    @ApiProperty({ description: 'The id of the message' })
    id: string;

    @ApiProperty({ description: 'The text content of the message' })
    content: string;

    @ApiProperty({ description: 'The pinned status of the message' })
    isPinned: boolean;

    @ApiProperty({ description: 'The deletion status of the message' })
    isDeleted: boolean;

    @ApiProperty({ description: 'The date when the message was created' })
    createdAt: Date;

    @ApiProperty({ description: 'The user that sent the message' })
    user: UserDTO;
}
