import { UserMapper } from '../../users/mapper/user.mapper';
import { Message } from '../domain/message.domain';
import { CreateMessageDTO } from '../dto/create-message.dto';
import { MessageDTO } from '../dto/message.dto';
import { UpdateMessageDTO } from '../dto/update-message.dto';

export class MessageMapper {
    static toDto(entity: Message): MessageDTO {
        const { id, content, isPinned, createdAt, user } = entity;
        return {
            id,
            content,
            isPinned,
            createdAt,
            user: UserMapper.toDTO(user)
        };
    }

    static fromCreateDto(createMessageDto: CreateMessageDTO): Message {
        const { content } = createMessageDto;
        return {
            id: undefined,
            content,
            isPinned: false,
            createdAt: undefined,
            user: undefined,
            channel: undefined
        };
    }

    static fromUpdateDto(id: string, updateMessageDto: UpdateMessageDTO): Message {
        const { content, isPinned } = updateMessageDto;
        return { id, content, isPinned, createdAt: undefined, user: undefined, channel: undefined };
    }
}
