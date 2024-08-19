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
            content: !isDeleted
                ? entity.content
                : 'This message was removed by a Board Administrator',
            isPinned: entity.isPinned,
            isDeleted: isDeleted,
            createdAt: entity.createdAt,
            user: UserMapper.toDTO(entity.user)
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
            channel: undefined
        };
    }

    static fromUpdateDto(id: string, updateMessageDto: UpdateMessageDTO): Message {
        const { content, isPinned, isDeleted } = updateMessageDto;
        return {
            id,
            content,
            isPinned,
            isDeleted,
            createdAt: undefined,
            user: undefined,
            channel: undefined
        };
    }
}
