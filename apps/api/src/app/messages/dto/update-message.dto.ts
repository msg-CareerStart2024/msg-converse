import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { UserDTO } from '../../users/dto/user.dto';

export class UpdateMessageDTO {
    @ApiProperty({ description: 'The pinned status of the message' })
    @IsBoolean()
    isPinned: boolean;

    @ApiProperty({ description: 'The deletion status of the message' })
    @IsBoolean()
    isDeleted: boolean;

    @ApiProperty({ description: 'Likes' })
    usersWhoLiked: UserDTO[];
}
