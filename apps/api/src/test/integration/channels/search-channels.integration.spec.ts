import { Test, TestingModule } from '@nestjs/testing';
import {
    createMockChannelRepository,
    createMockTopicService,
    createMockTransactionManager
} from '../../../app/channels/services/channels/channel.service.spec';

import { ChannelRepository } from '../../../app/channels/repository/channel.repository';
import { ChannelService } from '../../../app/channels/services/channels/channel.service';
import { TopicService } from '../../../app/channels/services/topics/topic.service';
import { TransactionManager } from '../../../app/shared/services/transaction.manager';
import { mockChannels } from '../../../app/channels/__mocks__/channel.mock';

describe('ChannelService - searchChannels Integration Test', () => {
    let channelService: ChannelService;
    let channelRepository: jest.Mocked<ChannelRepository>;

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

    describe('searchChannels', () => {
        it('should return all channels when search term is empty', async () => {
            channelRepository.findAll.mockResolvedValue(mockChannels);

            const result = await channelService.searchChannels('');

            expect(result).toEqual(mockChannels);
            expect(channelRepository.findAll).toHaveBeenCalledTimes(1);
            expect(channelRepository.searchChannels).not.toHaveBeenCalled();
        });

        it('should return filtered channels when search term is provided', async () => {
            const searchTerm = 'PROJECT';
            const filteredChannels = mockChannels.filter(
                channel =>
                    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    channel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    channel.topics.some(topic =>
                        topic.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
            );
            channelRepository.searchChannels.mockResolvedValue(filteredChannels);

            const result = await channelService.searchChannels(searchTerm);

            expect(result).toEqual(filteredChannels);
            expect(channelRepository.searchChannels).toHaveBeenCalledWith(searchTerm);
            expect(channelRepository.findAll).not.toHaveBeenCalled();
        });

        it('should return empty array when no channels match the search term', async () => {
            const searchTerm = 'nonexistent';
            channelRepository.searchChannels.mockResolvedValue([]);

            const result = await channelService.searchChannels(searchTerm);

            expect(result).toEqual([]);
            expect(channelRepository.searchChannels).toHaveBeenCalledWith(searchTerm);
        });

        it('should trim the search term before searching', async () => {
            const searchTerm = '  PROJECT  ';
            const filteredChannels = mockChannels.filter(
                channel =>
                    channel.name.toLowerCase().includes('project') ||
                    channel.description.toLowerCase().includes('project') ||
                    channel.topics.some(topic => topic.name.toLowerCase().includes('project'))
            );
            channelRepository.searchChannels.mockResolvedValue(filteredChannels);

            const result = await channelService.searchChannels(searchTerm);

            expect(result).toEqual(filteredChannels);
            expect(channelRepository.searchChannels).toHaveBeenCalledWith('PROJECT');
        });

        it('should search case-insensitively', async () => {
            const searchTerm = 'career';
            const filteredChannels = mockChannels.filter(
                channel =>
                    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    channel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    channel.topics.some(topic =>
                        topic.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
            );
            channelRepository.searchChannels.mockResolvedValue(filteredChannels);

            const result = await channelService.searchChannels(searchTerm);

            expect(result).toEqual(filteredChannels);
            expect(result.length).toBe(2);
            expect(channelRepository.searchChannels).toHaveBeenCalledWith(searchTerm);
        });

        it('should search by topic name', async () => {
            const searchTerm = 'SOFT_SKILLS';
            const filteredChannels = mockChannels.filter(channel =>
                channel.topics.some(topic => topic.name === searchTerm)
            );
            channelRepository.searchChannels.mockResolvedValue(filteredChannels);

            const result = await channelService.searchChannels(searchTerm);

            expect(result).toEqual(filteredChannels);
            expect(result.length).toBe(1);
            expect(channelRepository.searchChannels).toHaveBeenCalledWith(searchTerm);
        });

        it('should search by partial channel name', async () => {
            const searchTerm = 'msg';
            const filteredChannels = mockChannels.filter(channel =>
                channel.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            channelRepository.searchChannels.mockResolvedValue(filteredChannels);

            const result = await channelService.searchChannels(searchTerm);

            expect(result).toEqual(filteredChannels);
            expect(result.length).toBe(mockChannels.length);
            expect(channelRepository.searchChannels).toHaveBeenCalledWith(searchTerm);
        });

        it('should search by description', async () => {
            const searchTerm = 'overview';
            const filteredChannels = mockChannels.filter(channel =>
                channel.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            channelRepository.searchChannels.mockResolvedValue(filteredChannels);

            const result = await channelService.searchChannels(searchTerm);

            expect(result).toEqual(filteredChannels);
            expect(result.length).toBe(1);
            expect(channelRepository.searchChannels).toHaveBeenCalledWith(searchTerm);
        });

        it('should handle special characters in search term', async () => {
            const searchTerm = 'career&start';
            const escapedSearchTerm = 'career\\&start';
            channelRepository.searchChannels.mockResolvedValue([]);

            await channelService.searchChannels(searchTerm);

            expect(channelRepository.searchChannels).toHaveBeenCalledWith(escapedSearchTerm);
        });
    });
});
