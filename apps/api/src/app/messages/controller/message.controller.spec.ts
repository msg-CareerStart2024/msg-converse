import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './message.controller';
import { MessageService } from '../service/message.service';
import { MessageMapper } from '../mapper/message.mapper';
import { NotFoundException } from '@nestjs/common';
import {
    mockMessageCreateDto,
    mockMessages,
    mockMessageUpdateDto
} from '../__mocks__/message.mock';

describe('MessagesController', () => {
    let messagesController: MessagesController;
    let messageService: jest.Mocked<MessageService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MessagesController],
            providers: [
                {
                    provide: MessageService,
                    useValue: {
                        getByChannel: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn()
                    }
                }
            ]
        }).compile();

        messagesController = module.get<MessagesController>(MessagesController);
        messageService = module.get<MessageService>(MessageService) as jest.Mocked<MessageService>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getByChannel', () => {
        it('should return an array of MessageDTOs', async () => {
            messageService.getByChannel.mockResolvedValue(mockMessages);

            const result = await messagesController.getByChannel('channelId');

            expect(result).toEqual(mockMessages.map(message => MessageMapper.toDto(message)));
            expect(messageService.getByChannel).toHaveBeenCalledWith('channelId');
        });
    });

    describe('create', () => {
        it('should throw NotFoundException if the user or channel was not found', async () => {
            messageService.create.mockRejectedValue(new NotFoundException());

            await expect(
                messagesController.create('userId', 'channelId', mockMessageCreateDto)
            ).rejects.toThrow(NotFoundException);
        });
        it('should return a newly created MessageDTO', async () => {
            messageService.create.mockResolvedValue(mockMessages[0]);

            const result = await messagesController.create(
                'userId',
                'channelId',
                mockMessageCreateDto
            );

            expect(result).toEqual(MessageMapper.toDto(mockMessages[0]));
            expect(messageService.create).toHaveBeenCalledWith(
                'userId',
                'channelId',
                MessageMapper.fromCreateDto(mockMessageCreateDto)
            );
        });
    });

    describe('update', () => {
        it('should throw NotFoundException if the message was not found', async () => {
            messageService.update.mockRejectedValue(new NotFoundException());

            await expect(
                messagesController.update('messageId', mockMessageUpdateDto)
            ).rejects.toThrow(NotFoundException);
        });
        it('should return an updated MessageDTO', async () => {
            messageService.update.mockResolvedValue(mockMessages[1]);

            const result = await messagesController.update('messageId', mockMessageUpdateDto);

            expect(result).toEqual(MessageMapper.toDto(mockMessages[1]));
            expect(messageService.update).toHaveBeenCalledWith(
                'messageId',
                MessageMapper.fromUpdateDto('messageId', mockMessageUpdateDto)
            );
        });
    });

    describe('remove', () => {
        it('should throw NotFoundException if the message was not found', async () => {
            messageService.remove.mockRejectedValue(new NotFoundException());

            await expect(messagesController.remove('messageId')).rejects.toThrow(NotFoundException);
        });
        it('should call the remove method with the correct id', async () => {
            await messagesController.remove('messageId');

            expect(messageService.remove).toHaveBeenCalledWith('messageId');
        });
    });
});
