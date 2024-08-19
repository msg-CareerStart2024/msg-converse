import { Topic } from '../../channels/domain/topic.entity';
import { User } from '../../users/domain/user.domain';
import { Role } from '../../users/enums/role.enum';
import { Message } from '../domain/message.domain';
import { CreateMessageDTO } from '../dto/create-message.dto';
import { UpdateMessageDTO } from '../dto/update-message.dto';

export const mockMessageCreateDto: CreateMessageDTO = {
    content: 'message'
};

export const mockMessageUpdateDto: UpdateMessageDTO = {
    content: 'updated',
    isPinned: true,
    isDeleted: false
};

export const mockMessages: Message[] = [
    {
        id: 'acefe43f-67d9-4878-92e5-4bd304e9b94b',
        content: 'message',
        createdAt: new Date('2024-08-13 08:38:10.94152'),
        isPinned: false,
        isDeleted: false,
        user: {
            id: 'd832f104-9f27-49c4-b53f-46a67b8c8449',
            email: 'user@gmail.com',
            firstName: 'first',
            lastName: 'last',
            password: 'password',
            role: Role.ADMIN
        },
        channel: {
            id: '785f32ec-8d20-4e35-8d77-d5503966df48',
            name: 'channel',
            description: 'description',
            createdAt: new Date('2024-08-09T00:00:00Z'),
            users: [] as User[],
            topics: [] as Topic[],
            messages: [] as Message[]
        }
    },
    {
        id: 'baefa6b0-d2bd-4efe-bebe-b68c86533e92',
        content: 'updated',
        createdAt: new Date('2024-08-13 08:38:10.94152'),
        isPinned: true,
        isDeleted: false,
        user: {
            id: 'd832f104-9f27-49c4-b53f-46a67b8c8449',
            email: 'user@gmail.com',
            firstName: 'first',
            lastName: 'last',
            password: 'password',
            role: Role.ADMIN
        },
        channel: {
            id: '785f32ec-8d20-4e35-8d77-d5503966df48',
            name: 'channel',
            description: 'description',
            createdAt: new Date('2024-08-09T00:00:00Z'),
            users: [] as User[],
            topics: [] as Topic[],
            messages: [] as Message[]
        }
    }
];
