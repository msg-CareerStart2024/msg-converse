import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageService } from '../service/message.service';
import { MessageDTO } from '../dto/message.dto';
import { MessageMapper } from '../mapper/message.mapper';
import { CreateMessageDTO } from '../dto/create-message.dto';
import { CurrentUserId } from '../../auth/decorators/current-user-id.decorator';
import { UpdateMessageDTO } from '../dto/update-message.dto';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
    constructor(private readonly messageService: MessageService) {}

    @Get(':channelId')
    @ApiOperation({
        summary: 'Get all messages from a channel'
    })
    @ApiParam({
        name: 'channelId',
        description: 'ID of the channel'
    })
    @ApiResponse({
        status: 200,
        description: 'List of messages retrieved successfully',
        type: [MessageDTO]
    })
    @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated' })
    async getByChannel(@Param('channelId') channelId: string): Promise<MessageDTO[]> {
        const messages = await this.messageService.getByChannel(channelId);
        return messages.map(message => MessageMapper.toDto(message));
    }

    @Post(':channelId')
    @ApiOperation({ summary: 'Create a new message' })
    @ApiResponse({
        status: 201,
        description: 'Message created successfully',
        type: MessageDTO
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(
        @CurrentUserId() userId: string,
        @Param('channelId') channelId: string,
        @Body() createMessageDto: CreateMessageDTO
    ): Promise<MessageDTO> {
        const message = MessageMapper.fromCreateDto(createMessageDto);
        const newMessage = await this.messageService.create(userId, channelId, message);
        return MessageMapper.toDto(newMessage);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a message' })
    @ApiParam({
        name: 'id',
        description: 'ID of the message to update'
    })
    @ApiResponse({
        status: 200,
        description: 'Message updated successfully',
        type: MessageDTO
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Message not found' })
    async update(
        @Param('id') id: string,
        @Body() updateMessageDto: UpdateMessageDTO
    ): Promise<MessageDTO> {
        const updateData = MessageMapper.fromUpdateDto(id, updateMessageDto);
        const updatedChannel = await this.messageService.update(id, updateData);
        return MessageMapper.toDto(updatedChannel);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete a message'
    })
    @ApiParam({
        name: 'id',
        description: 'ID of the message thas to be deleted'
    })
    async remove(@Param('id') id: string): Promise<void> {
        await this.messageService.remove(id);
    }
}
