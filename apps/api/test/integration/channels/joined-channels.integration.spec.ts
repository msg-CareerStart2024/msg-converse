import { Test, TestingModule } from '@nestjs/testing';
import {
    createMockChannelRepository,
    createMockTopicService,
    createMockTransactionManager,
    createMockUserService
} from '../../../src/app/channels/services/channels/channel.service.spec';

import { ChannelRepository } from '../../../src/app/channels/repository/channel.repository';
import { ChannelService } from '../../../src/app/channels/services/channels/channel.service';
import { Role } from '../../../src/app/users/enums/role.enum';
import { TopicService } from '../../../src/app/channels/services/topics/topic.service';
import { TransactionManager } from '../../../src/app/shared/services/transaction.manager';
import { User } from '../../../src/app/users/domain/user.domain';
import { UserService } from '../../../src/app/users/service/user.service';
import { mockChannels } from '../../../src/app/channels/__mocks__/channel.mock';
import { mockTopics } from '../../../src/app/channels/__mocks__/topic.mock';

describe('ChannelService - getChannelsJoinedByUser Integration Test', () => {
    let channelService: ChannelService;
    let channelRepository: jest.Mocked<ChannelRepository>;

    const mockUser: User = {
        id: 'mock-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
        role: Role.USER
    };

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
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getChannelsJoinedByUser', () => {
        it('should return channels joined by the user', async () => {
            const joinedChannels = [
                { ...mockChannels[0], topics: [mockTopics[0]] },
                { ...mockChannels[1], topics: [mockTopics[1]] }
            ];
            channelRepository.getChannelsJoinedByUser.mockResolvedValue(joinedChannels);

            const result = await channelService.getChannelsJoinedByUser(mockUser.id);

            expect(result).toEqual(joinedChannels);
            expect(channelRepository.getChannelsJoinedByUser).toHaveBeenCalledWith(mockUser.id);
        });

        it('should return an empty array when the user has not joined any channels', async () => {
            channelRepository.getChannelsJoinedByUser.mockResolvedValue([]);

            const result = await channelService.getChannelsJoinedByUser(mockUser.id);

            expect(result).toEqual([]);
            expect(channelRepository.getChannelsJoinedByUser).toHaveBeenCalledWith(mockUser.id);
        });

        it('should propagate errors from the repository', async () => {
            const error = new Error('Database error');
            channelRepository.getChannelsJoinedByUser.mockRejectedValue(error);

            await expect(channelService.getChannelsJoinedByUser(mockUser.id)).rejects.toThrow(
                error
            );
            expect(channelRepository.getChannelsJoinedByUser).toHaveBeenCalledWith(mockUser.id);
        });

        it('should return channels with their associated topics', async () => {
            const joinedChannels = [
                { ...mockChannels[0], topics: [mockTopics[0]] },
                { ...mockChannels[1], topics: mockTopics }
            ];
            channelRepository.getChannelsJoinedByUser.mockResolvedValue(joinedChannels);

            const result = await channelService.getChannelsJoinedByUser(mockUser.id);

            expect(result).toEqual(joinedChannels);
            expect(result[0].topics).toBeDefined();
            expect(result[0].topics.length).toBe(1);
            expect(result[1].topics.length).toBe(2);
        });

        it('should not include user data in the returned channels', async () => {
            const joinedChannels = [{ ...mockChannels[0], users: [], topics: [mockTopics[0]] }];
            channelRepository.getChannelsJoinedByUser.mockResolvedValue(joinedChannels);

            const result = await channelService.getChannelsJoinedByUser(mockUser.id);

            expect(result[0].users).toEqual([]);
        });

        it('should work correctly for users with different roles', async () => {
            const adminUser = { ...mockUser, id: 'admin-user-id', role: Role.ADMIN };
            const joinedChannels = [{ ...mockChannels[0], topics: [mockTopics[0]] }];
            channelRepository.getChannelsJoinedByUser.mockResolvedValue(joinedChannels);

            const result = await channelService.getChannelsJoinedByUser(adminUser.id);

            expect(result).toEqual(joinedChannels);
            expect(channelRepository.getChannelsJoinedByUser).toHaveBeenCalledWith(adminUser.id);
        });
    });
});
