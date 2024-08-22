import { UserMapper } from '../../users/mapper/user.mapper';
import { Message } from '../domain/message.domain';
import { CreateMessageDTO } from '../dto/create-message.dto';
import { MessageDTO } from '../dto/message.dto';
import { UpdateMessageDTO } from '../dto/update-message.dto';

export class MessageMapper {
    static toDto(entity: Message): MessageDTO {
        const { isDeleted } = entity;
        return {
            id: entity.id,
            content: entity.content,
            isPinned: entity.isPinned,
            isDeleted: isDeleted,
            createdAt: entity.createdAt,
            user: UserMapper.toDTO(entity.user),
            likes: entity.likes.map(like => UserMapper.toDTO(like))
        };
    }

    static fromDto(messageDto: MessageDTO): Message {
        const { id, content, isPinned, isDeleted, createdAt, user, likes } = messageDto;
        return {
            id,
            content,
            isPinned,
            isDeleted,
            channel: undefined,
            createdAt,
            user: UserMapper.fromDto(user),
            likes: likes.map(like => UserMapper.fromDto(like))
        };
    }

    static fromCreateDto(createMessageDto: CreateMessageDTO): Message {
        const { content } = createMessageDto;
        return {
            id: undefined,
            content,
            isPinned: false,
            isDeleted: false,
            createdAt: undefined,
            user: undefined,
            channel: undefined,
            likes: []
        };
    }

    static fromUpdateDto(id: string, updateMessageDto: UpdateMessageDTO): Message {
        const { isPinned, isDeleted } = updateMessageDto;
        return {
            id,
            content: undefined,
            isPinned,
            isDeleted,
            createdAt: undefined,
            user: undefined,
            channel: undefined,
            likes: undefined
        };
    }
}
