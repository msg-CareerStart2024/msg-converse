import { NotFoundException } from '@nestjs/common';
import { UserService } from '../../users/service/user.service';
import { Message } from '../domain/message.domain';
import { MessageRepository } from '../repository/message.repository';
import { MessageService } from './message.service';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../users/domain/user.domain';
import { Channel } from '../../channels/domain/channel.entity';
import { ChannelService } from '../../channels/services/channels/channel.service';
import { mockMessages } from '../__mocks__/message.mock';

describe('MessageService', () => {
    let messageService: MessageService;
    let messageRepository: jest.Mocked<MessageRepository>;
    let userService: jest.Mocked<UserService>;
    let channelService: jest.Mocked<ChannelService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MessageService,
                {
                    provide: MessageRepository,
                    useValue: {
                        getByChannel: jest.fn(),
                        getById: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn()
                    }
                },
                {
                    provide: UserService,
                    useValue: {
                        getById: jest.fn()
                    }
                },
                {
                    provide: ChannelService,
                    useValue: {
                        getById: jest.fn()
                    }
                }
            ]
        }).compile();

        messageService = module.get<MessageService>(MessageService);
        messageRepository = module.get<MessageRepository>(
            MessageRepository
        ) as jest.Mocked<MessageRepository>;
        userService = module.get<UserService>(UserService) as jest.Mocked<UserService>;
        channelService = module.get<ChannelService>(ChannelService) as jest.Mocked<ChannelService>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(messageService).toBeDefined();
    });

    describe('getByChannel', () => {
        it('should return an array of messages', async () => {
            messageRepository.getByChannel.mockResolvedValue(mockMessages);

            expect(await messageService.getByChannel('channelId')).toBe(mockMessages);
        });
    });

    describe('create', () => {
        it('should throw NotFoundException if user was not found', async () => {
            userService.getById.mockResolvedValue(null);

            await expect(
                messageService.create('userId', 'channelId', { content: 'Hello' } as Message)
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if channel was not found', async () => {
            userService.getById.mockResolvedValue({} as User);
            channelService.getById.mockResolvedValue(null);

            await expect(
                messageService.create('userId', 'channelId', { content: 'Hello' } as Message)
            ).rejects.toThrow(NotFoundException);
        });

        it('should create and return a new message', async () => {
            const mockUser = { id: 'userId' };
            const mockChannel = { id: 'channelId' };
            const mockMessage = { content: 'Hello' } as Message;

            messageRepository.create.mockResolvedValue(mockMessage);
            userService.getById.mockResolvedValue(mockUser as User);
            channelService.getById.mockResolvedValue(mockChannel as Channel);

            const result = await messageService.create('userId', 'channelId', mockMessage);
            expect(result).toBe(mockMessage);
            expect(messageRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    content: 'Hello',
                    isPinned: false,
                    user: mockUser,
                    channel: mockChannel
                })
            );
        });
    });

    describe('update', () => {
        it('should throw NotFoundException if message was not found', async () => {
            messageRepository.getById.mockResolvedValue(null);

            await expect(
                messageService.update('messageId', { content: 'Updated' } as Message)
            ).rejects.toThrow(NotFoundException);
        });

        it('should update and return the updated message', async () => {
            const mockMessage = { id: 'messageId', content: 'Hello', isPinned: false } as Message;
            messageRepository.getById.mockResolvedValue(mockMessage);
            messageRepository.update.mockResolvedValue(mockMessage);

            const result = await messageService.update('messageId', {
                content: 'Updated',
                isPinned: true
            } as Message);

            expect(result).toBe(mockMessage);
            expect(messageRepository.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    content: 'Updated',
                    isPinned: true
                })
            );
        });
    });

    describe('remove', () => {
        it('should remove the message', async () => {
            await messageService.remove('messageId');
            expect(messageRepository.remove).toHaveBeenCalledWith('messageId');
        });
    });
});
