import { Test, TestingModule } from '@nestjs/testing';
import {
    mockChannels,
    mockUpdateChannelData
} from '../../../src/app/channels/__mocks__/channel.mock';

import { ChannelRepository } from '../../../src/app/channels/repository/channel.repository';
import { ChannelService } from '../../../src/app/channels/services/channels/channel.service';
import { EntityManager } from 'typeorm';
import { TopicService } from '../../../src/app/channels/services/topics/topic.service';
import { TransactionManager } from '../../../src/app/shared/services/transaction.manager';

describe('ChannelService - update Integration Test', () => {
    let channelService: ChannelService;
    let channelRepository: jest.Mocked<ChannelRepository>;
    let topicService: jest.Mocked<TopicService>;
    let mockEntityManager: jest.Mocked<EntityManager>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChannelService,
                {
                    provide: ChannelRepository,
                    useFactory: () => ({
                        getOneById: jest.fn(),
                        save: jest.fn()
                    })
                },
                {
                    provide: TopicService,
                    useFactory: () => ({
                        getOrCreateTopics: jest.fn()
                    })
                },
                {
                    provide: TransactionManager,
                    useFactory: () => ({
                        runInTransaction: jest.fn(callback => callback(mockEntityManager))
                    })
                }
            ]
        }).compile();

        channelService = module.get<ChannelService>(ChannelService);
        channelRepository = module.get(ChannelRepository);
        topicService = module.get(TopicService);
        mockEntityManager = {} as jest.Mocked<EntityManager>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('update', () => {
        it('should update channel with new topics', async () => {
            const channelId = mockChannels[0].id;
            const newTopics = [
                { name: 'New Topic 1', id: undefined, channels: [] },
                { name: 'New Topic 2', id: undefined, channels: [] }
            ];
            const updateData = {
                name: 'Updated Channel',
                description: 'Updated Description',
                topics: newTopics
            };
            const existingChannel = { ...mockChannels[0] };
            const updatedTopics = [
                { id: 'new-id-1', name: 'New Topic 1', channels: [] },
                { id: 'new-id-2', name: 'New Topic 2', channels: [] }
            ];
            const updatedChannel = {
                ...existingChannel,
                ...updateData,
                topics: updatedTopics
            };

            channelRepository.getOneById.mockResolvedValue(existingChannel);
            topicService.getOrCreateTopics.mockResolvedValue(updatedTopics);
            channelRepository.save.mockResolvedValue(updatedChannel);

            // @ts-expect-error - TS doesnt recognize the description field as optional
            const result = await channelService.update(channelId, updateData);

            expect(result).toEqual(updatedChannel);
            expect(topicService.getOrCreateTopics).toHaveBeenCalledWith(
                ['New Topic 1', 'New Topic 2'],
                mockEntityManager
            );
            expect(channelRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: channelId,
                    name: 'Updated Channel',
                    description: 'Updated Description',
                    topics: updatedTopics
                }),
                mockEntityManager
            );
        });

        it('should only update provided fields', async () => {
            const channelId = mockChannels[0].id;
            const partialUpdate = { name: 'Updated Name' };
            const existingChannel = mockChannels[0];
            const updatedChannel = { ...existingChannel, ...partialUpdate };

            channelRepository.getOneById.mockResolvedValue(existingChannel);
            channelRepository.save.mockResolvedValue(updatedChannel);

            const result = await channelService.update(channelId, partialUpdate);

            expect(result).toEqual(updatedChannel);
            expect(result.description).toBe(existingChannel.description);
        });

        it('should handle empty update data', async () => {
            const channelId = mockChannels[0].id;
            const emptyUpdate = {};
            const existingChannel = mockChannels[0];

            channelRepository.getOneById.mockResolvedValue(existingChannel);
            channelRepository.save.mockResolvedValue(existingChannel);

            const result = await channelService.update(channelId, emptyUpdate);

            expect(result).toEqual(existingChannel);
            expect(channelRepository.save).toHaveBeenCalledWith(existingChannel, mockEntityManager);
        });

        it('should trim updated name and description', async () => {
            const channelId = mockChannels[0].id;
            const updateData = { name: '  Trimmed Name  ', description: '  Trimmed Description  ' };
            const existingChannel = mockChannels[0];
            const expectedUpdatedChannel = {
                ...existingChannel,
                name: 'Trimmed Name',
                description: 'Trimmed Description'
            };

            channelRepository.getOneById.mockResolvedValue(existingChannel);
            channelRepository.save.mockResolvedValue(expectedUpdatedChannel);

            const result = await channelService.update(channelId, updateData);

            expect(result.name).toBe('Trimmed Name');
            expect(result.description).toBe('Trimmed Description');
        });

        it('should handle update with null description', async () => {
            const channelId = mockChannels[0].id;
            const updateData = { description: null };
            const existingChannel = mockChannels[0];
            const updatedChannel = { ...existingChannel, description: null };

            channelRepository.getOneById.mockResolvedValue(existingChannel);
            // @ts-expect-error - TS doesnt recognize the description field as optional
            channelRepository.save.mockResolvedValue(updatedChannel);
            // @ts-expect-error - TS doesnt recognize the description field as optional
            const result = await channelService.update(channelId, updateData);

            expect(result.description).toBeNull();
        });

        it('should handle database errors during update', async () => {
            const channelId = mockChannels[0].id;
            const updateData = mockUpdateChannelData;
            const dbError = new Error('Database error');

            channelRepository.getOneById.mockResolvedValue(mockChannels[0]);
            channelRepository.save.mockRejectedValue(dbError);

            await expect(channelService.update(channelId, updateData)).rejects.toThrow(
                'Database error'
            );
        });

        it('should update channel with maximum allowed name length', async () => {
            const channelId = mockChannels[0].id;
            const maxLengthName = 'a'.repeat(100);
            const updateData = { name: maxLengthName };
            const existingChannel = mockChannels[0];
            const updatedChannel = { ...existingChannel, name: maxLengthName };

            channelRepository.getOneById.mockResolvedValue(existingChannel);
            channelRepository.save.mockResolvedValue(updatedChannel);

            const result = await channelService.update(channelId, updateData);

            expect(result.name).toBe(maxLengthName);
            expect(result.name.length).toBe(100);
        });

        it('should handle update with duplicate topic names', async () => {
            const channelId = mockChannels[0].id;
            const updateData = {
                topics: [
                    { name: 'Topic1', id: undefined, channels: [] },
                    { name: 'Topic1', id: undefined, channels: [] },
                    { name: 'Topic2', id: undefined, channels: [] }
                ]
            };
            const existingChannel = mockChannels[0];
            const uniqueTopics = [
                { id: '1', name: 'Topic1', channels: [] },
                { id: '2', name: 'Topic2', channels: [] }
            ];
            const updatedChannel = { ...existingChannel, topics: uniqueTopics };

            channelRepository.getOneById.mockResolvedValue(existingChannel);
            topicService.getOrCreateTopics.mockResolvedValue(uniqueTopics);
            channelRepository.save.mockResolvedValue(updatedChannel);
            // @ts-expect-error - TS doesnt recognize the description field as optional
            const result = await channelService.update(channelId, updateData);

            expect(result.topics).toHaveLength(2);
            expect(topicService.getOrCreateTopics).toHaveBeenCalledWith(
                ['Topic1', 'Topic1', 'Topic2'],
                mockEntityManager
            );

            expect(channelRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    topics: uniqueTopics
                }),
                mockEntityManager
            );
        });
    });
});
