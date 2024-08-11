import { Test, TestingModule } from '@nestjs/testing';
import {
    createMockChannelRepository,
    createMockTopicService,
    createMockTransactionManager
} from '../../../src/app/channels/services/channels/channel.service.spec';

import { ChannelRepository } from '../../../src/app/channels/repository/channel.repository';
import { ChannelService } from '../../../src/app/channels/services/channels/channel.service';
import { TopicService } from '../../../src/app/channels/services/topics/topic.service';
import { TransactionManager } from '../../../src/app/shared/services/transaction.manager';
import { mockChannels } from '../../../src/app/channels/__mocks__/channel.mock';

describe('ChannelService - getById Integration Test', () => {
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

    describe('getById', () => {
        it('should successfully retrieve a channel by id', async () => {
            channelRepository.findOneById.mockResolvedValue(mockChannels[0]);

            const result = await channelService.getById(mockChannels[0].id);

            expect(result).toEqual(mockChannels[0]);
            expect(channelRepository.findOneById).toHaveBeenCalledWith(mockChannels[0].id);
        });

        it('should handle and rethrow repository errors', async () => {
            const error = new Error('Database error');
            channelRepository.findOneById.mockRejectedValue(error);

            await expect(channelService.getById('1')).rejects.toThrow('Database error');
            expect(channelRepository.findOneById).toHaveBeenCalledWith('1');
        });

        it('should handle retrieval with a valid UUID', async () => {
            const uuid = '123e4567-e89b-12d3-a456-426614174000';
            channelRepository.findOneById.mockResolvedValue({
                ...mockChannels[0],
                id: uuid
            });

            const result = await channelService.getById(uuid);

            expect(result.id).toBe(uuid);
            expect(channelRepository.findOneById).toHaveBeenCalledWith(uuid);
        });
    });
});
