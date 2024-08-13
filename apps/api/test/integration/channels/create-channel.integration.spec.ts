import { Test, TestingModule } from '@nestjs/testing';
import {
    createMockChannelRepository,
    createMockTopicService,
    createMockTransactionManager,
    createMockUserService
} from '../../../src/app/channels/services/channels/channel.service.spec';

import { Channel } from '../../../src/app/channels/domain/channel.entity';
import { ChannelRepository } from '../../../src/app/channels/repository/channel.repository';
import { ChannelService } from '../../../src/app/channels/services/channels/channel.service';
import { EntityManager } from 'typeorm';
import { Role } from '../../../src/app/users/enums/role.enum';
import { TopicService } from '../../../src/app/channels/services/topics/topic.service';
import { TransactionManager } from '../../../src/app/shared/services/transaction.manager';
import { User } from '../../../src/app/users/domain/user.domain';
import { UserService } from '../../../src/app/users/service/user.service';
import { mockNewChannelData } from '../../../src/app/channels/__mocks__/channel.mock';
import { mockTopics } from '../../../src/app/channels/__mocks__/topic.mock';

export const mockUser: User = {
    id: 'mock-user-id',
    email: 'david.nan@mail.com',
    firstName: 'david',
    lastName: 'nan',
    password: '123',
    role: Role.USER
};

describe('ChannelService - create Integration Test', () => {
    let channelService: ChannelService;
    let channelRepository: jest.Mocked<ChannelRepository>;
    let topicService: jest.Mocked<TopicService>;
    let userService: jest.Mocked<UserService>;
    let transactionManager: jest.Mocked<TransactionManager>;
    let mockEntityManager: jest.Mocked<EntityManager>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChannelService,
                {
                    provide: ChannelRepository,
                    useFactory: createMockChannelRepository
                },
                {
                    provide: TopicService,
                    useFactory: createMockTopicService
                },
                {
                    provide: UserService,
                    useFactory: createMockUserService
                },
                {
                    provide: TransactionManager,
                    useFactory: createMockTransactionManager
                }
            ]
        }).compile();

        channelService = module.get<ChannelService>(ChannelService);
        channelRepository = module.get(ChannelRepository);
        topicService = module.get(TopicService);
        userService = module.get(UserService);
        transactionManager = module.get(TransactionManager);
        mockEntityManager = {} as jest.Mocked<EntityManager>;

        transactionManager.runInTransaction.mockImplementation(callback =>
            callback(mockEntityManager)
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new channel with topics and user successfully', async () => {
            const newChannelData: Omit<Channel, 'id' | 'createdAt'> = mockNewChannelData;
            const createdTopics = mockTopics;
            const expectedSavedChannel: Channel = {
                ...newChannelData,
                id: 'generated-id',
                createdAt: new Date(),
                topics: createdTopics,
                users: [mockUser],
                messages: []
            };

            userService.getById.mockResolvedValue(mockUser);
            topicService.getOrCreateTopics.mockResolvedValue(createdTopics);
            channelRepository.save.mockResolvedValue(expectedSavedChannel);

            const result = await channelService.create(newChannelData, mockUser.id);

            expect(result).toEqual(expectedSavedChannel);
            expect(transactionManager.runInTransaction).toHaveBeenCalled();
            expect(userService.getById).toHaveBeenCalledWith(mockUser.id);
            expect(topicService.getOrCreateTopics).toHaveBeenCalledWith(
                newChannelData.topics.map(t => t.name),
                mockEntityManager
            );
            expect(channelRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: newChannelData.name,
                    description: newChannelData.description,
                    topics: createdTopics,
                    users: [mockUser],
                    messages: []
                }),
                mockEntityManager
            );
        });

        it('should handle database error for duplicate channel name', async () => {
            userService.getById.mockResolvedValue(mockUser);
            topicService.getOrCreateTopics.mockResolvedValue(mockTopics);
            const duplicateError = new Error('Duplicate entry');
            channelRepository.save.mockRejectedValue(duplicateError);

            await expect(channelService.create(mockNewChannelData, mockUser.id)).rejects.toThrow(
                duplicateError
            );

            expect(userService.getById).toHaveBeenCalledWith(mockUser.id);
            expect(topicService.getOrCreateTopics).toHaveBeenCalled();
            expect(channelRepository.save).toHaveBeenCalled();
            expect(transactionManager.runInTransaction).toHaveBeenCalled();
        });

        it('should create a channel with no description', async () => {
            const channelData = { ...mockNewChannelData, description: undefined };
            const expectedSavedChannel: Channel = {
                ...channelData,
                id: 'generated-id',
                createdAt: new Date(),
                topics: mockTopics,
                users: [mockUser],
                description: undefined,
                messages: []
            };

            userService.getById.mockResolvedValue(mockUser);
            topicService.getOrCreateTopics.mockResolvedValue(mockTopics);
            channelRepository.save.mockResolvedValue(expectedSavedChannel);

            const result = await channelService.create(channelData, mockUser.id);

            expect(result.description).toBeUndefined();
        });

        it('should handle topic creation failure', async () => {
            userService.getById.mockResolvedValue(mockUser);
            topicService.getOrCreateTopics.mockRejectedValue(new Error('Topic creation failed'));

            await expect(channelService.create(mockNewChannelData, mockUser.id)).rejects.toThrow(
                'Topic creation failed'
            );
            expect(channelRepository.save).not.toHaveBeenCalled();
        });

        it('should trim channel name and description', async () => {
            const untrimmedData = {
                ...mockNewChannelData,
                name: '  Untrimmed Name  ',
                description: '  Untrimmed Description  '
            };
            const expectedSavedChannel: Channel = {
                ...untrimmedData,
                name: 'Untrimmed Name',
                description: 'Untrimmed Description',
                id: 'generated-id',
                createdAt: new Date(),
                topics: mockTopics,
                users: [mockUser],
                messages: []
            };

            userService.getById.mockResolvedValue(mockUser);
            topicService.getOrCreateTopics.mockResolvedValue(mockTopics);
            channelRepository.save.mockResolvedValue(expectedSavedChannel);

            const result = await channelService.create(untrimmedData, mockUser.id);

            expect(result.name).toBe('Untrimmed Name');
            expect(result.description).toBe('Untrimmed Description');
        });
    });
});
