import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ChannelService } from '../services/channel.service';
import { ChannelDto } from '../dto/channels/channel.dto';
import { ChannelMapper } from '../mapper/channel.mapper';
@ApiTags('channels')
@ApiBearerAuth()
@Controller('channels')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @Get()
    @ApiOperation({
        summary: 'Get all channels'
    })
    @ApiResponse({
        status: 200,
        description: 'List of channels retrieved successfully',
        type: [ChannelDto]
    })
    @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated' })
    async getAllChannels(): Promise<ChannelDto[]> {
        const channels = await this.channelService.getAll();
        return channels.map(channel => ChannelMapper.toDto(channel));
    }

    @Get(':channelId')
    @ApiOperation({
        summary: 'Get a channel by ID'
    })
    @ApiParam({
        name: 'channelId',
        description: 'ID of the channel',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Channel details retrieved successfully',
        type: ChannelDto
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getChannelById(@Param('channelId') channelId: string): Promise<ChannelDto> {
        const channel = await this.channelService.getById(channelId);
        return ChannelMapper.toDto(channel);
    }

    @Delete(':channelId')
    @ApiOperation({
        summary: 'Delete a channel'
    })
    @ApiParam({
        name: 'channelId',
        description: 'ID of the channel thas to be deleted',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    async deleteChannel(@Param('channelId') channelId: string): Promise<void> {
        return await this.channelService.delete(channelId);
    }
}
