import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
    mockChannelDtoWithTopics,
    mockChannelFactory,
    mockChannelWithTopics,
    mockChannels,
    mockCreateChannelDto,
    mockUpdateChannelDto
} from '../../__mocks__/channel.mock';

import { ChannelController } from './channel.controller';
import { ChannelMapper } from '../../mapper/channel.mapper';
import { ChannelService } from '../../services/channels/channel.service';

describe('ChannelController', () => {
    let controller: ChannelController;
    let channelService: jest.Mocked<ChannelService>;

    beforeEach(async () => {
        const mockChannelService = {
            searchChannels: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ChannelController],
            providers: [
                {
                    provide: ChannelService,
                    useValue: mockChannelService
                }
            ]
        }).compile();

        controller = module.get<ChannelController>(ChannelController);
        channelService = module.get(ChannelService);

        jest.spyOn(ChannelMapper, 'fromUpdateDto').mockImplementation(updateDto => ({
            ...mockChannelWithTopics,
            name: updateDto.name || mockChannelWithTopics.name,
            description: updateDto.description || mockChannelWithTopics.description,
            topics: updateDto.topics
                ? updateDto.topics.map((topic, index) => ({
                      id: `topic${index + 1}`,
                      name: topic.name,
                      channels: []
                  }))
                : mockChannelWithTopics.topics
        }));
        jest.spyOn(ChannelMapper, 'fromCreateDto').mockReturnValue(mockChannelWithTopics);
        jest.spyOn(ChannelMapper, 'fromUpdateDto').mockReturnValue(mockChannelWithTopics);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('searchChannels', () => {
        it('should return an array of ChannelDto when searching channels', async () => {
            channelService.searchChannels.mockResolvedValue(mockChannels);

            const result = await controller.searchChannels(`${mockChannels[0].name}`);

            expect(result).toEqual(mockChannels.map(channel => ChannelMapper.toDto(channel)));
            expect(channelService.searchChannels).toHaveBeenCalledWith(`${mockChannels[0].name}`);
        });

        it('should return all channels when no search key is provided', async () => {
            channelService.searchChannels.mockResolvedValue(mockChannels);

            const result = await controller.searchChannels();

            expect(result).toEqual(mockChannels.map(channel => ChannelMapper.toDto(channel)));
            expect(channelService.searchChannels).toHaveBeenCalledWith('');
        });

        it('should return an empty array when no channels match the search criteria', async () => {
            channelService.searchChannels.mockResolvedValue([]);

            const result = await controller.searchChannels('nonexistent');

            expect(result).toEqual([]);
            expect(channelService.searchChannels).toHaveBeenCalledWith('nonexistent');
        });
    });

    describe('getChannelById', () => {
        it('should return a ChannelDto when getting a`` channel by id', async () => {
            channelService.getById.mockResolvedValue(mockChannelWithTopics);

            const result = await controller.getChannelById('1');

            expect(result).toEqual(mockChannelDtoWithTopics);
            expect(channelService.getById).toHaveBeenCalledWith('1');
        });

        it('should throw NotFoundException when channel is not found', async () => {
            channelService.getById.mockRejectedValue(new NotFoundException('Channel not found'));

            await expect(controller.getChannelById('nonexistent')).rejects.toThrow(
                NotFoundException
            );
            expect(channelService.getById).toHaveBeenCalledWith('nonexistent');
        });
    });

    describe('createChannel', () => {
        it('should create a new channel and return a ChannelDto', async () => {
            channelService.create.mockResolvedValue(mockChannelWithTopics);

            const result = await controller.createChannel(mockCreateChannelDto);

            expect(result).toEqual(mockChannelDtoWithTopics);
            expect(channelService.create).toHaveBeenCalledWith(expect.any(Object));
            expect(ChannelMapper.fromCreateDto).toHaveBeenCalledWith(mockCreateChannelDto);
        });

        it('should throw BadRequestException when creation fails due to invalid data', async () => {
            channelService.create.mockRejectedValue(
                new BadRequestException('Invalid channel data')
            );

            await expect(
                controller.createChannel({ ...mockCreateChannelDto, name: '' })
            ).rejects.toThrow(BadRequestException);
        });

        it('should handle creation of channel with maximum allowed topics', async () => {
            const maxTopicsChannel = mockChannelFactory(
                '1',
                'Max Topics Channel',
                'Description',
                new Date(),
                Array(5).fill({ id: '1', name: 'TOPIC' })
            );
            channelService.create.mockResolvedValue(maxTopicsChannel);

            const result = await controller.createChannel({
                ...mockCreateChannelDto,
                topics: Array(5).fill({ name: 'TOPIC' })
            });

            expect(result).toEqual(ChannelMapper.toDto(maxTopicsChannel));
        });
    });

    describe('updateChannel', () => {
        it('should update an existing channel and return a ChannelDto', async () => {
            channelService.update.mockResolvedValue(mockChannelWithTopics);

            const result = await controller.updateChannel('1', mockUpdateChannelDto);

            expect(result).toEqual(mockChannelDtoWithTopics);
            expect(channelService.update).toHaveBeenCalledWith('1', expect.any(Object));
            expect(ChannelMapper.fromUpdateDto).toHaveBeenCalledWith(mockUpdateChannelDto);
        });

        it('should handle update of channel with mix of existing and new topics', async () => {
            const updateDtoWithMixedTopics = {
                ...mockUpdateChannelDto,
                topics: [
                    { name: 'EXISTING_TOPIC_1' },
                    { name: 'NEW_TOPIC' },
                    { name: 'EXISTING_TOPIC_2' }
                ]
            };

            const updatedChannelWithMixedTopics = {
                ...mockChannelWithTopics,
                name: 'Updated Channel',
                description: 'Updated Description',
                topics: [
                    { id: 'existing1', name: 'EXISTING_TOPIC_1', channels: [] },
                    { id: 'new1', name: 'NEW_TOPIC', channels: [] },
                    { id: 'existing2', name: 'EXISTING_TOPIC_2', channels: [] }
                ]
            };

            jest.spyOn(ChannelMapper, 'fromUpdateDto').mockReturnValue(
                updatedChannelWithMixedTopics
            );
            channelService.update.mockResolvedValue(updatedChannelWithMixedTopics);

            const result = await controller.updateChannel('1', updateDtoWithMixedTopics);

            expect(ChannelMapper.fromUpdateDto).toHaveBeenCalledWith(updateDtoWithMixedTopics);
            expect(channelService.update).toHaveBeenCalledWith(
                '1',
                expect.objectContaining({
                    name: 'Updated Channel',
                    description: 'Updated Description',
                    topics: expect.arrayContaining([
                        expect.objectContaining({ name: 'EXISTING_TOPIC_1' }),
                        expect.objectContaining({ name: 'NEW_TOPIC' }),
                        expect.objectContaining({ name: 'EXISTING_TOPIC_2' })
                    ])
                })
            );
            expect(result).toEqual(ChannelMapper.toDto(updatedChannelWithMixedTopics));
        });

        it('should throw NotFoundException when updating a non-existent channel', async () => {
            channelService.update.mockRejectedValue(new NotFoundException('Channel not found'));

            await expect(
                controller.updateChannel('nonexistent', mockUpdateChannelDto)
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteChannel', () => {
        it('should delete a channel', async () => {
            await controller.deleteChannel('1');

            expect(channelService.delete).toHaveBeenCalledWith('1');
        });

        it('should throw NotFoundException when deleting a non-existent channel', async () => {
            channelService.delete.mockRejectedValue(new NotFoundException('Channel not found'));

            await expect(controller.deleteChannel('nonexistent')).rejects.toThrow(
                NotFoundException
            );
        });
    });
});
