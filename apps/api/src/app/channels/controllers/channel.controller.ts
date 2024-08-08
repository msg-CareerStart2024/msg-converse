import { Controller, Get, Param, Delete, Post, Body, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ChannelService } from '../services/channel.service';
import { ChannelDto } from '../dto/channels/channel.dto';
import { ChannelMapper } from '../mapper/channel.mapper';
import { CreateChannelDto } from '../dto/channels/create-channel.dto';
import { UpdateChannelDto } from '../dto/channels/update-channel.dto';
@ApiTags('channels')
@ApiBearerAuth()
@Controller('channels')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @Get()
    @ApiOperation({ summary: 'Search channels by a key' })
    @ApiResponse({ status: 200, description: 'Successful operation', type: [ChannelDto] })
    async searchChannels(@Query('searchKey') searchKey: string): Promise<ChannelDto[]> {
        return await this.channelService.searchChannels(searchKey);
    }

    @Get(':channelId')
    @ApiOperation({
        summary: 'Get a channel by ID'
    })
    @ApiParam({
        name: 'channelId',
        description: 'ID of the channel'
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

    @Post()
    @ApiOperation({ summary: 'Create a new channel' })
    @ApiResponse({
        status: 201,
        description: 'Channel created successfully',
        type: ChannelDto
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createChannel(@Body() createChannelDto: CreateChannelDto): Promise<ChannelDto> {
        const newChannel = ChannelMapper.fromCreateDto(createChannelDto);
        const createdChannel = await this.channelService.create(newChannel);
        return ChannelMapper.toDto(createdChannel);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a channel' })
    @ApiParam({
        name: 'channelId',
        description: 'ID of the channel to update',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Channel updated successfully',
        type: ChannelDto
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    async updateChannel(
        @Param('id') channelId: string,
        @Body() updateChannelDto: UpdateChannelDto
    ): Promise<ChannelDto> {
        const updateData = ChannelMapper.fromUpdateDto(updateChannelDto);
        const updatedChannel = await this.channelService.update(channelId, updateData);
        return ChannelMapper.toDto(updatedChannel);
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
