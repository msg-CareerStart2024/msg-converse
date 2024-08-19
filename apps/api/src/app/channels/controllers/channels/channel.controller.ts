import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { CurrentUserId } from '../../../auth/decorators/current-user-id.decorator';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../users/enums/role.enum';
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

    @Get('joined')
    @ApiOperation({
        summary: 'Get channels joined by user',
        description: 'Retrieve a list of channels joined by a specific user.'
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved channels joined by user',
        type: [ChannelDto]
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Valid authentication credentials are required'
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getChannelsJoinedByUser(@CurrentUserId() userId: string): Promise<ChannelDto[]> {
        const channels = await this.channelService.getChannelsJoinedByUser(userId);
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
    @Roles([Role.ADMIN])
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
    async createChannel(
        @CurrentUserId() userId: string,
        @Body() createChannelDto: CreateChannelDto
    ): Promise<ChannelDto> {
        const newChannel = ChannelMapper.fromCreateDto(createChannelDto);
        const createdChannel = await this.channelService.create(newChannel, userId);
        return ChannelMapper.toDto(createdChannel);
    }

    @Put(':channelId')
    @Roles([Role.ADMIN])
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
    @Roles([Role.ADMIN])
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

    @Post(':channelId/enroll')
    @Roles([Role.ADMIN, Role.USER])
    @ApiOperation({
        summary: 'Join a channel',
        description: 'Join a specific channel to participate in discussions.'
    })
    @ApiParam({
        name: 'channelId',
        description: 'Unique identifier of the channel to be joined'
    })
    @ApiResponse({ status: 204, description: 'Channel successfully joined' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Valid authentication credentials are required'
    })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    async joinChannel(
        @CurrentUserId() userId: string,
        @Param('channelId') channelId: string
    ): Promise<ChannelDto> {
        const joinedChannel = await this.channelService.joinChannel(channelId, userId);
        return ChannelMapper.toDto(joinedChannel);
    }

    @Post(':channelId/leave')
    @Roles([Role.ADMIN, Role.USER])
    @ApiOperation({
        summary: 'Leave a channel',
        description: 'Leave a specific channel.'
    })
    @ApiParam({
        name: 'channelId',
        description: 'Unique identifier of the channel to be left'
    })
    @ApiResponse({ status: 204, description: 'Channel successfully left' })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Valid authentication credentials are required'
    })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    async leaveChannel(
        @CurrentUserId() userId: string,
        @Param('channelId') channelId: string
    ): Promise<ChannelDto> {
        const leftChannel = await this.channelService.leaveChannel(channelId, userId);
        return ChannelMapper.toDto(leftChannel);
    }
}
