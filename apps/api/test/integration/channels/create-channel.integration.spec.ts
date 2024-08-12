// import { Test, TestingModule } from '@nestjs/testing';
// import {
//     createMockChannelRepository,
//     createMockTopicService,
//     createMockTransactionManager
// } from '../../../src/app/channels/services/channels/channel.service.spec';

// import { Channel } from '../../../src/app/channels/domain/channel.entity';
// import { ChannelRepository } from '../../../src/app/channels/repository/channel.repository';
// import { ChannelService } from '../../../src/app/channels/services/channels/channel.service';
// import { EntityManager } from 'typeorm';
// import { TopicService } from '../../../src/app/channels/services/topics/topic.service';
// import { TransactionManager } from '../../../src/app/shared/services/transaction.manager';
// import { mockNewChannelData } from '../../../src/app/channels/__mocks__/channel.mock';
// import { mockTopics } from '../../../src/app/channels/__mocks__/topic.mock';

// describe('ChannelService - create Integration Test', () => {
//     let channelService: ChannelService;
//     let channelRepository: jest.Mocked<ChannelRepository>;
//     let topicService: jest.Mocked<TopicService>;
//     let transactionManager: jest.Mocked<TransactionManager>;
//     let mockEntityManager: jest.Mocked<EntityManager>;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 ChannelService,
//                 {
//                     provide: ChannelRepository,
//                     useFactory: createMockChannelRepository
//                 },
//                 {
//                     provide: TopicService,
//                     useFactory: createMockTopicService
//                 },
//                 {
//                     provide: TransactionManager,
//                     useFactory: createMockTransactionManager
//                 }
//             ]
//         }).compile();

//         channelService = module.get<ChannelService>(ChannelService);
//         channelRepository = module.get(ChannelRepository);
//         topicService = module.get(TopicService);
//         transactionManager = module.get(TransactionManager);
//         mockEntityManager = {} as jest.Mocked<EntityManager>;

//         transactionManager.runInTransaction.mockImplementation(callback =>
//             callback(mockEntityManager)
//         );
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     describe('create', () => {
//         it('should create a new channel with topics successfully', async () => {
//             const newChannelData: Omit<Channel, 'id' | 'createdAt'> = mockNewChannelData;
//             const createdTopics = mockTopics;
//             const expectedSavedChannel: Channel = {
//                 ...newChannelData,
//                 id: 'generated-id',
//                 createdAt: new Date(),
//                 topics: createdTopics
//             };

//             topicService.getOrCreateTopics.mockResolvedValue(createdTopics);
//             channelRepository.save.mockResolvedValue(expectedSavedChannel);

//             const result = await channelService.create(newChannelData);
//             2;
//             expect(result).toEqual(expectedSavedChannel);
//             expect(transactionManager.runInTransaction).toHaveBeenCalled();
//             expect(topicService.getOrCreateTopics).toHaveBeenCalledWith(
//                 newChannelData.topics.map(t => t.name),
//                 mockEntityManager
//             );
//             expect(channelRepository.save).toHaveBeenCalledWith(
//                 expect.objectContaining({
//                     name: newChannelData.name,
//                     description: newChannelData.description,
//                     topics: createdTopics
//                 }),
//                 mockEntityManager
//             );
//         });

//         it('should handle database error for duplicate channel name', async () => {
//             topicService.getOrCreateTopics.mockResolvedValue(mockTopics);
//             const duplicateError = new Error('Duplicate entry');
//             channelRepository.save.mockRejectedValue(duplicateError);

//             await expect(channelService.create(mockNewChannelData)).rejects.toThrow(duplicateError);

//             expect(topicService.getOrCreateTopics).toHaveBeenCalled();
//             expect(channelRepository.save).toHaveBeenCalled();
//             expect(transactionManager.runInTransaction).toHaveBeenCalled();
//         });

//         it('should create a channel with null description', async () => {
//             const channelData = { ...mockNewChannelData, description: null };
//             // @ts-expect-error - TS doesnt recognize the description field as optional
//             const expectedSavedChannel: Channel = {
//                 ...channelData,
//                 id: 'generated-id',
//                 createdAt: new Date(),
//                 topics: mockTopics
//             };

//             topicService.getOrCreateTopics.mockResolvedValue(mockTopics);
//             channelRepository.save.mockResolvedValue(expectedSavedChannel);

//             // @ts-expect-error - TS doesnt recognize the description field as optional
//             const result = await channelService.create(channelData);

//             expect(result.description).toBeNull();
//         });

//         it('should handle topic creation failure', async () => {
//             topicService.getOrCreateTopics.mockRejectedValue(new Error('Topic creation failed'));

//             await expect(channelService.create(mockNewChannelData)).rejects.toThrow(
//                 'Topic creation failed'
//             );
//             expect(channelRepository.save).not.toHaveBeenCalled();
//         });

//         it('should trim channel name and description', async () => {
//             const untrimmedData = {
//                 ...mockNewChannelData,
//                 name: '  Untrimmed Name  ',
//                 description: '  Untrimmed Description  '
//             };
//             const expectedSavedChannel: Channel = {
//                 ...untrimmedData,
//                 name: 'Untrimmed Name',
//                 description: 'Untrimmed Description',
//                 id: 'generated-id',
//                 createdAt: new Date(),
//                 topics: mockTopics
//             };

//             topicService.getOrCreateTopics.mockResolvedValue(mockTopics);
//             channelRepository.save.mockResolvedValue(expectedSavedChannel);

//             const result = await channelService.create(untrimmedData);

//             expect(result.name).toBe('Untrimmed Name');
//             expect(result.description).toBe('Untrimmed Description');
//         });

//         it('should handle transaction rollback on error', async () => {
//             const error = new Error('Unexpected error');
//             topicService.getOrCreateTopics.mockResolvedValue(mockTopics);
//             channelRepository.save.mockRejectedValue(error);

//             await expect(channelService.create(mockNewChannelData)).rejects.toThrow(
//                 'Unexpected error'
//             );
//             expect(transactionManager.runInTransaction).toHaveBeenCalled();
//         });
//     });
// });
