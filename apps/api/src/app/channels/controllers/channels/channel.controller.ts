import { Controller, Get, Param, Delete, Post, Body, Put, Query } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
    ApiQuery
} from '@nestjs/swagger';
import { ChannelDto } from '../../dto/channels/channel.dto';
import { CreateChannelDto } from '../../dto/channels/create-channel.dto';
import { UpdateChannelDto } from '../../dto/channels/update-channel.dto';
import { ChannelMapper } from '../../mapper/channel.mapper';
import { ChannelService } from '../../services/channels/channel.service';

@ApiTags('Channels')
@ApiBearerAuth()
@Controller('channels')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @Get()
    @ApiOperation({
        summary: 'Search channels',
        description: 'Retrieve a list of channels based on an optional search key.'
    })
    @ApiQuery({
        name: 'searchKey',
        required: false,
        description: 'Optional search key to filter channels',
        type: String
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved channels',
        type: [ChannelDto]
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Valid authentication credentials are required'
    })
    async searchChannels(@Query('searchKey') searchKey = ''): Promise<ChannelDto[]> {
        const channels = await this.channelService.searchChannels(searchKey);
        return channels.map(channel => ChannelMapper.toDto(channel));
    }

    @Get(':channelId')
    @ApiOperation({
        summary: 'Get channel by ID',
        description: 'Retrieve detailed information about a specific channel.'
    })
    @ApiParam({
        name: 'channelId',
        description: 'Unique identifier of the channel'
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved channel details',
        type: ChannelDto
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Valid authentication credentials are required'
    })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    async getChannelById(@Param('channelId') channelId: string): Promise<ChannelDto> {
        const channel = await this.channelService.getById(channelId);
        return ChannelMapper.toDto(channel);
    }

    @Post()
    @ApiOperation({
        summary: 'Create a new channel',
        description: 'Create a new channel with the provided details.'
    })
    @ApiResponse({
        status: 201,
        description: 'Channel created successfully',
        type: ChannelDto
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid input' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Valid authentication credentials are required'
    })
    async createChannel(@Body() createChannelDto: CreateChannelDto): Promise<ChannelDto> {
        const newChannel = ChannelMapper.fromCreateDto(createChannelDto);
        const createdChannel = await this.channelService.create(newChannel);
        return ChannelMapper.toDto(createdChannel);
    }

    @Put(':channelId')
    @ApiOperation({
        summary: 'Update a channel',
        description: 'Update an existing channel with the provided details.'
    })
    @ApiParam({
        name: 'channelId',
        description: 'Unique identifier of the channel to update'
    })
    @ApiResponse({
        status: 200,
        description: 'Channel updated successfully',
        type: ChannelDto
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid input' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Valid authentication credentials are required'
    })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    async updateChannel(
        @Param('channelId') channelId: string,
        @Body() updateChannelDto: UpdateChannelDto
    ): Promise<ChannelDto> {
        const updateData = ChannelMapper.fromUpdateDto(updateChannelDto);
        const updatedChannel = await this.channelService.update(channelId, updateData);
        return ChannelMapper.toDto(updatedChannel);
    }

    @Delete(':channelId')
    @ApiOperation({
        summary: 'Delete a channel',
        description: 'Permanently remove a channel from the system.'
    })
    @ApiParam({
        name: 'channelId',
        description: 'Unique identifier of the channel to be deleted'
    })
    @ApiResponse({ status: 204, description: 'Channel successfully deleted' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Valid authentication credentials are required'
    })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    async deleteChannel(@Param('channelId') channelId: string): Promise<void> {
        return await this.channelService.delete(channelId);
    }
}
