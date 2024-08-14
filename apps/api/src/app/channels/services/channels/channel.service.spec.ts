import { Test, TestingModule } from '@nestjs/testing';
import {
    mockChannels,
    mockNewChannelData,
    mockUpdateChannelData
} from '../../__mocks__/channel.mock';

import { Channel } from '../../domain/channel.entity';
import { ChannelRepository } from '../../repository/channel.repository';
import { ChannelService } from './channel.service';
import { EntityManager } from 'typeorm';
import { TopicRepository } from '../../repository/topics/topic.repository';
import { TopicService } from '../topics/topic.service';
import { TransactionManager } from '../../../shared/services/transaction.manager';
import { UserService } from '../../../users/service/user.service';
import { mockTopics } from '../../__mocks__/topic.mock';

export const createMockChannelRepository = (): jest.Mocked<ChannelRepository> => {
    const mock = {
        getOneById: jest.fn(),
        getAll: jest.fn(),
        findByName: jest.fn(),
        searchChannels: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
        getRepo: jest.fn(),
        getChannelsJoinedByUser: jest.fn()
    };

    return mock as unknown as jest.Mocked<ChannelRepository>;
};

export const createMockTopicRepository = (): jest.Mocked<TopicRepository> => {
    const mock = {
        getById: jest.fn(),
        getAll: jest.fn(),
        findOrCreateTopics: jest.fn(),
        findByName: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
        getRepo: jest.fn()
    };

    return mock as unknown as jest.Mocked<TopicRepository>;
};

export const createMockUserService = () => ({
    getById: jest.fn(),
    getByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
});

type MockedTopicService = {
    [K in keyof TopicService]: jest.Mock;
};

export const createMockTopicService = (): jest.Mocked<TopicService> => {
    const mockedService: MockedTopicService = {
        getAll: jest.fn(),
        create: jest.fn(),
        getOrCreateTopics: jest.fn(),
        getByName: jest.fn(),
        getById: jest.fn(),
        remove: jest.fn()
    };

    return Object.setPrototypeOf(
        mockedService,
        TopicService.prototype
    ) as jest.Mocked<TopicService>;
};

export const createMockTransactionManager = (): jest.Mocked<TransactionManager> =>
    ({
        runInTransaction: jest.fn().mockImplementation(callback => callback(mockEntityManager))
    }) as unknown as jest.Mocked<TransactionManager>;

export const mockEntityManager: jest.Mocked<EntityManager> = {
    transaction: jest.fn().mockImplementation(callback => callback(mockEntityManager))
} as unknown as jest.Mocked<EntityManager>;

describe('ChannelService', () => {
    let channelService: ChannelService;
    let channelRepository: ReturnType<typeof createMockChannelRepository>;
    let topicService: ReturnType<typeof createMockTopicService>;
    let transactionManager: ReturnType<typeof createMockTransactionManager>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                ChannelService,
                { provide: ChannelRepository, useFactory: createMockChannelRepository },
                { provide: TopicService, useFactory: createMockTopicService },
                { provide: UserService, useFactory: createMockUserService },
                { provide: TransactionManager, useFactory: createMockTransactionManager }
            ]
        }).compile();

        channelService = module.get<ChannelService>(ChannelService);
        channelRepository = module.get(ChannelRepository);
        topicService = module.get(TopicService);
        transactionManager = module.get(TransactionManager);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('searchChannels', () => {
        it('should return all channels when search term is empty or whitespace', async () => {
            channelRepository.searchChannels.mockResolvedValue(mockChannels);

            const result1: Channel[] = await channelService.searchChannels('');
            const result2: Channel[] = await channelService.searchChannels('   ');

            expect(result1).toEqual(mockChannels);
            expect(result2).toEqual(mockChannels);
            expect(channelRepository.searchChannels).toHaveBeenCalledTimes(2);
            expect(channelRepository.searchChannels).toHaveBeenCalledWith('');
            expect(channelRepository.getAll).not.toHaveBeenCalled();
        });

        it('should search channels when search term is provided', async () => {
            const searchTerm = 'test';
            const expectedResult: Channel[] = [mockChannels[0]];
            channelRepository.searchChannels.mockResolvedValue(expectedResult);

            const result: Channel[] = await channelService.searchChannels(searchTerm);

            expect(result).toEqual(expectedResult);
            expect(channelRepository.searchChannels).toHaveBeenCalledWith(searchTerm);
            expect(channelRepository.getAll).not.toHaveBeenCalled();
        });

        it('should return empty array when no channels match the search term', async () => {
            const searchTerm = 'nonexistent';
            channelRepository.searchChannels.mockResolvedValue([]);

            const result = await channelService.searchChannels(searchTerm);

            expect(result).toEqual([]);
            expect(channelRepository.searchChannels).toHaveBeenCalledWith(searchTerm);
            expect(channelRepository.getAll).not.toHaveBeenCalled();
        });

        it('should trim the search term before searching', async () => {
            const untrimmedSearchTerm = '  test  ';
            const trimmedSearchTerm = 'test';
            channelRepository.searchChannels.mockResolvedValue([]);

            await channelService.searchChannels(untrimmedSearchTerm);

            expect(channelRepository.searchChannels).toHaveBeenCalledWith(trimmedSearchTerm);
        });
    });

    describe('getById', () => {
        it('should return a channel by id', async () => {
            const channelId = '1';
            const expectedChannel = mockChannels[0];
            channelRepository.getOneById.mockResolvedValue(expectedChannel);

            const result = await channelService.getById(channelId);

            expect(result).toEqual(expectedChannel);
            expect(channelRepository.getOneById).toHaveBeenCalledWith(channelId);
        });

        it('should return null when channel is not found', async () => {
            const nonExistentId = 'nonexistent';
            channelRepository.getOneById.mockResolvedValue(null);

            const result = await channelService.getById(nonExistentId);

            expect(result).toBeNull();
            expect(channelRepository.getOneById).toHaveBeenCalledWith(nonExistentId);
        });
    });

    describe('getChannelsJoinedByUser', () => {
        const userId = 'test-user-id';

        beforeEach(() => {
            channelRepository.getChannelsJoinedByUser = jest.fn();
        });

        it('should return channels joined by the user', async () => {
            channelRepository.getChannelsJoinedByUser.mockResolvedValue(mockChannels);

            const result = await channelService.getChannelsJoinedByUser(userId);

            expect(result).toEqual(mockChannels);
            expect(channelRepository.getChannelsJoinedByUser).toHaveBeenCalledWith(userId);
        });

        it('should return an empty array when the user has not joined any channels', async () => {
            channelRepository.getChannelsJoinedByUser.mockResolvedValue([]);

            const result = await channelService.getChannelsJoinedByUser(userId);

            expect(result).toEqual([]);
            expect(channelRepository.getChannelsJoinedByUser).toHaveBeenCalledWith(userId);
        });

        it('should throw an error if the repository method fails', async () => {
            const error = new Error('Database error');
            channelRepository.getChannelsJoinedByUser.mockRejectedValue(error);

            await expect(channelService.getChannelsJoinedByUser(userId)).rejects.toThrow(error);
            expect(channelRepository.getChannelsJoinedByUser).toHaveBeenCalledWith(userId);
        });

        it('should not include user data in the returned channels', async () => {
            channelRepository.getChannelsJoinedByUser.mockResolvedValue(mockChannels);

            const result = await channelService.getChannelsJoinedByUser(userId);

            expect(result).toEqual(mockChannels);
            result.forEach(channel => {
                expect(channel.users).toEqual([]);
            });
        });

        it('should return channels with their associated topics', async () => {
            channelRepository.getChannelsJoinedByUser.mockResolvedValue(mockChannels);

            const result = await channelService.getChannelsJoinedByUser(userId);

            expect(result).toEqual(mockChannels);
            result.forEach(channel => {
                expect(Array.isArray(channel.topics)).toBeTruthy();
                expect(channel.topics.length).toBeGreaterThan(0);
            });
        });
    });

    describe('create', () => {
        it('should create a new channel with topics', async () => {
            const newChannelData: Omit<Channel, 'id' | 'createdAt'> = mockNewChannelData;
            const createdTopics = mockTopics;
            const expectedSavedChannel: Channel = {
                ...newChannelData,
                id: expect.any(String),
                createdAt: expect.any(Date),
                topics: createdTopics
            };

            topicService.getOrCreateTopics.mockResolvedValue(createdTopics);
            channelRepository.save.mockResolvedValue(expectedSavedChannel);

            const result: Channel = await channelService.create(newChannelData, 'user-id');

            expect(result).toEqual(expectedSavedChannel);
            expect(transactionManager.runInTransaction).toHaveBeenCalled();
            expect(topicService.getOrCreateTopics).toHaveBeenCalledWith(
                newChannelData.topics.map(t => t.name),
                expect.any(Object)
            );
            expect(channelRepository.save).toHaveBeenCalledWith(
                {
                    name: newChannelData.name,
                    description: newChannelData.description,
                    topics: createdTopics,
                    messages: [],
                    users: [],
                    id: undefined,
                    createdAt: undefined
                },
                expect.any(Object)
            );
        });

        it('should throw an error if channel creation fails', async () => {
            const error = new Error('Channel creation failed');
            channelRepository.save.mockRejectedValue(error);

            await expect(channelService.create(mockNewChannelData, 'user-id')).rejects.toThrow(
                error
            );
            expect(transactionManager.runInTransaction).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should update an existing channel with new topics', async () => {
            const channelId = '1';
            const updateData = mockUpdateChannelData;
            const existingChannel = mockChannels[0];
            const updatedTopics = mockTopics;
            const expectedUpdatedChannel = {
                ...existingChannel,
                ...updateData,
                topics: updatedTopics
            };

            channelRepository.getOneById.mockResolvedValue(existingChannel);
            topicService.getOrCreateTopics.mockResolvedValue(updatedTopics);
            channelRepository.save.mockResolvedValue(expectedUpdatedChannel);

            const result = await channelService.update(channelId, updateData);

            expect(result).toEqual(expectedUpdatedChannel);
            expect(transactionManager.runInTransaction).toHaveBeenCalled();
            expect(channelRepository.getOneById).toHaveBeenCalledWith(channelId);
            expect(topicService.getOrCreateTopics).toHaveBeenCalledWith(
                updateData.topics.map(t => t.name),
                expect.any(Object)
            );
            expect(channelRepository.save).toHaveBeenCalledWith(
                expectedUpdatedChannel,
                expect.any(Object)
            );
        });

        it('should update channel without changing topics', async () => {
            const channelId = '1';
            const updateDataWithoutTopics = {
                name: 'Updated Name',
                description: 'Updated Description'
            };
            const existingChannel = mockChannels[0];
            const expectedUpdatedChannel = {
                ...existingChannel,
                ...updateDataWithoutTopics
            };

            channelRepository.getOneById.mockResolvedValue(existingChannel);
            channelRepository.save.mockResolvedValue(expectedUpdatedChannel);

            const result = await channelService.update(channelId, updateDataWithoutTopics);

            expect(result).toEqual(expectedUpdatedChannel);
            expect(transactionManager.runInTransaction).toHaveBeenCalled();
            expect(topicService.getOrCreateTopics).not.toHaveBeenCalled();
            expect(channelRepository.save).toHaveBeenCalledWith(
                expectedUpdatedChannel,
                expect.any(Object)
            );
        });

        it('should update an existing channel with mixed topics (existing, new)', async () => {
            const channelId = '1';
            const existingTopic = mockTopics[0];
            const newTopicName = 'New Topic';
            const updateData = {
                ...mockUpdateChannelData,
                topics: [{ name: existingTopic.name }, { name: newTopicName }]
            };
            const existingChannel = mockChannels[0];
            const updatedTopics = [
                existingTopic,
                { id: 'new-id', name: newTopicName, channels: [] }
            ];
            const expectedUpdatedChannel = {
                ...existingChannel,
                ...updateData,
                topics: updatedTopics
            };

            channelRepository.getOneById.mockResolvedValue(existingChannel);
            topicService.getOrCreateTopics.mockResolvedValue(updatedTopics);
            channelRepository.save.mockResolvedValue(expectedUpdatedChannel);

            const result = await channelService.update(channelId, updateData as Partial<Channel>);

            expect(result).toEqual(expectedUpdatedChannel);
            expect(transactionManager.runInTransaction).toHaveBeenCalled();
            expect(channelRepository.getOneById).toHaveBeenCalledWith(channelId);
            expect(topicService.getOrCreateTopics).toHaveBeenCalledWith(
                [existingTopic.name, newTopicName],
                expect.any(Object)
            );
            expect(channelRepository.save).toHaveBeenCalledWith(
                expectedUpdatedChannel,
                expect.any(Object)
            );
        });

        it('should throw an error when updating non-existent channel', async () => {
            const nonExistentId = 'nonexistent';
            channelRepository.getOneById.mockResolvedValue(null);

            await expect(
                channelService.update(nonExistentId, mockUpdateChannelData)
            ).rejects.toThrow();
            expect(transactionManager.runInTransaction).toHaveBeenCalled();
            expect(channelRepository.getOneById).toHaveBeenCalledWith(nonExistentId);
        });

        it('should only update provided fields', async () => {
            const channelId = '1';
            const partialUpdate = { name: 'Updated Name' };
            const existingChannel = mockChannels[0];
            const expectedUpdatedChannel = { ...existingChannel, ...partialUpdate };

            channelRepository.getOneById.mockResolvedValue(existingChannel);
            channelRepository.save.mockResolvedValue(expectedUpdatedChannel);

            const result = await channelService.update(channelId, partialUpdate);

            expect(result).toEqual(expectedUpdatedChannel);
            expect(channelRepository.save).toHaveBeenCalledWith(
                expectedUpdatedChannel,
                expect.any(Object)
            );
            expect(result.description).toBe(existingChannel.description);
        });
    });

    describe('delete', () => {
        it('should delete a channel without entity manager', async () => {
            const channelId = '1';

            await channelService.delete(channelId);

            expect(channelRepository.remove).toHaveBeenCalledWith(channelId, undefined);
        });

        it('should delete a channel with entity manager', async () => {
            const channelId = '1';
            const mockEntityManager = {} as EntityManager;

            await channelService.delete(channelId, mockEntityManager);

            expect(channelRepository.remove).toHaveBeenCalledWith(channelId, mockEntityManager);
        });

        it('should throw an error when deleting non-existent channel', async () => {
            const nonExistentId = 'nonexistent';
            const error = new Error('Channel not found');
            channelRepository.remove.mockRejectedValue(error);

            await expect(channelService.delete(nonExistentId)).rejects.toThrow(error);
            expect(channelRepository.remove).toHaveBeenCalledWith(nonExistentId, undefined);
        });
    });
});
