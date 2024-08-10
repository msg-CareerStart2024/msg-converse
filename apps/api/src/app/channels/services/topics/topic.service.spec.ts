import { EntityManager, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { Topic } from '../../domain/topic.entity';
import { TopicRepository } from '../../repository/topics/topic.repository';
import { TopicService } from './topic.service';

export const mockTopics: Topic[] = [
    { id: '1', name: 'Topic 1', channels: [] },
    { id: '2', name: 'Topic 2', channels: [] }
];

export const createMockTopicRepository = (): jest.Mocked<TopicRepository> => {
    const mockRepository: jest.Mocked<Repository<Topic>> = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
        createQueryBuilder: jest.fn()
    } as unknown as jest.Mocked<Repository<Topic>>;

    return {
        repository: mockRepository,
        getAll: jest.fn(),
        save: jest.fn(),
        findOrCreateTopics: jest.fn(),
        findByName: jest.fn(),
        getById: jest.fn(),
        deleteById: jest.fn(),
        getRepo: jest.fn().mockReturnValue(mockRepository)
    } as unknown as jest.Mocked<TopicRepository>;
};

export const createMockEntityManager = (): jest.Mocked<EntityManager> =>
    ({
        getRepository: jest.fn()
    }) as unknown as jest.Mocked<EntityManager>;

describe('TopicService', () => {
    let topicService: TopicService;
    let topicRepository: jest.Mocked<TopicRepository>;
    let mockEntityManager: jest.Mocked<EntityManager>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TopicService,
                {
                    provide: TopicRepository,
                    useFactory: createMockTopicRepository
                }
            ]
        }).compile();

        topicService = module.get<TopicService>(TopicService);
        topicRepository = module.get(TopicRepository);
        mockEntityManager = createMockEntityManager();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return all topics', async () => {
            topicRepository.getAll.mockResolvedValue(mockTopics);

            const result = await topicService.getAll();

            expect(result).toEqual(mockTopics);
            expect(topicRepository.getAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('create', () => {
        const topicData: Partial<Topic> = { name: 'New Topic' };
        const createdTopic: Topic = { id: '3', name: 'New Topic', channels: [] };

        it('should create a new topic without entity manager', async () => {
            topicRepository.save.mockResolvedValue(createdTopic);

            const result = await topicService.create(topicData);

            expect(result).toEqual(createdTopic);
            expect(topicRepository.save).toHaveBeenCalledWith(
                expect.objectContaining(topicData),
                undefined
            );
        });

        it('should create a new topic with entity manager', async () => {
            topicRepository.save.mockResolvedValue(createdTopic);

            const result = await topicService.create(topicData, mockEntityManager);

            expect(result).toEqual(createdTopic);
            expect(topicRepository.save).toHaveBeenCalledWith(
                expect.objectContaining(topicData),
                mockEntityManager
            );
        });
    });

    describe('getOrCreateTopics', () => {
        const topicNames = ['Topic 1', 'Topic 2'];

        it('should get or create topics', async () => {
            topicRepository.findOrCreateTopics.mockResolvedValue(mockTopics);

            const result = await topicService.getOrCreateTopics(topicNames, mockEntityManager);

            expect(result).toEqual(mockTopics);
            expect(topicRepository.findOrCreateTopics).toHaveBeenCalledWith(
                topicNames,
                mockEntityManager
            );
        });

        it('should handle duplicate topic names', async () => {
            const duplicateTopicNames = ['Topic 1', 'Topic 1', 'Topic 2'];
            topicRepository.findOrCreateTopics.mockResolvedValue(mockTopics);

            const result = await topicService.getOrCreateTopics(
                duplicateTopicNames,
                mockEntityManager
            );

            expect(result).toEqual(mockTopics);
            expect(topicRepository.findOrCreateTopics).toHaveBeenCalledWith(
                ['Topic 1', 'Topic 2'],
                mockEntityManager
            );
        });
    });

    describe('getByName', () => {
        it('should return a topic by name', async () => {
            const topicName = 'Topic 1';
            const mockTopic = mockTopics[0];
            topicRepository.findByName.mockResolvedValue(mockTopic);

            const result = await topicService.getByName(topicName);

            expect(result).toEqual(mockTopic);
            expect(topicRepository.findByName).toHaveBeenCalledWith(topicName);
        });
    });

    describe('getById', () => {
        it('should return a topic by id', async () => {
            const topicId = '1';
            const mockTopic = mockTopics[0];
            topicRepository.getById.mockResolvedValue(mockTopic);

            const result = await topicService.getById(topicId);

            expect(result).toEqual(mockTopic);
            expect(topicRepository.getById).toHaveBeenCalledWith(topicId);
        });
    });

    describe('delete', () => {
        const topicId = '1';

        it('should delete a topic without entity manager', async () => {
            await topicService.delete(topicId);

            expect(topicRepository.deleteById).toHaveBeenCalledWith(topicId, undefined);
        });

        it('should delete a topic with entity manager', async () => {
            await topicService.delete(topicId, mockEntityManager);

            expect(topicRepository.deleteById).toHaveBeenCalledWith(topicId, mockEntityManager);
        });
    });
});
