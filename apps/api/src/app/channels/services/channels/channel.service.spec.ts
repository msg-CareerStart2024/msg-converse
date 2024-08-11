import { EntityManager, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { mockCreateTopicDto, mockTopic, mockTopics } from '../../__mocks__/topic.mock';

import { Topic } from '../../domain/topic.entity';
import { TopicRepository } from '../../repository/topics/topic.repository';
import { TopicService } from '../topics/topic.service';

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
        it('should create a new topic without entity manager', async () => {
            topicRepository.save.mockResolvedValue(mockTopic);

            const result = await topicService.create(mockCreateTopicDto);

            expect(result).toEqual(mockTopic);
            expect(topicRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({ name: mockCreateTopicDto.name }),
                undefined
            );
        });

        it('should create a new topic with entity manager', async () => {
            topicRepository.save.mockResolvedValue(mockTopic);

            const result = await topicService.create(mockCreateTopicDto, mockEntityManager);

            expect(result).toEqual(mockTopic);
            expect(topicRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({ name: mockCreateTopicDto.name }),
                mockEntityManager
            );
        });
    });

    describe('getOrCreateTopics', () => {
        const topicNames = mockTopics.map(topic => topic.name);

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
            const duplicateTopicNames = [...topicNames, topicNames[0]];
            topicRepository.findOrCreateTopics.mockResolvedValue(mockTopics);

            const result = await topicService.getOrCreateTopics(
                duplicateTopicNames,
                mockEntityManager
            );

            expect(result).toEqual(mockTopics);
            expect(topicRepository.findOrCreateTopics).toHaveBeenCalledWith(
                topicNames,
                mockEntityManager
            );
        });
    });

    describe('getByName', () => {
        it('should return a topic by name', async () => {
            topicRepository.findByName.mockResolvedValue(mockTopic);

            const result = await topicService.getByName(mockTopic.name);

            expect(result).toEqual(mockTopic);
            expect(topicRepository.findByName).toHaveBeenCalledWith(mockTopic.name);
        });
    });

    describe('getById', () => {
        it('should return a topic by id', async () => {
            topicRepository.getById.mockResolvedValue(mockTopic);

            const result = await topicService.getById(mockTopic.id);

            expect(result).toEqual(mockTopic);
            expect(topicRepository.getById).toHaveBeenCalledWith(mockTopic.id);
        });
    });

    describe('delete', () => {
        it('should delete a topic without entity manager', async () => {
            await topicService.delete(mockTopic.id);

            expect(topicRepository.deleteById).toHaveBeenCalledWith(mockTopic.id, undefined);
        });

        it('should delete a topic with entity manager', async () => {
            await topicService.delete(mockTopic.id, mockEntityManager);

            expect(topicRepository.deleteById).toHaveBeenCalledWith(
                mockTopic.id,
                mockEntityManager
            );
        });
    });
});
