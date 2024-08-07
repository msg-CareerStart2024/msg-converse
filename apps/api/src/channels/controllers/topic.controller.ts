import { Controller, Get, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { TopicService } from '../services/topic.service';
import { TopicDto } from '../dto/topics/topic.dto';
import { TopicMapper } from '../mapper/topic.mapper';

@ApiTags('topics')
@ApiBearerAuth()
@Controller('topics')
export class TopicController {
    constructor(private readonly topicService: TopicService) {}

    @Get()
    @ApiOperation({
        summary: 'Get all topics'
    })
    @ApiResponse({
        status: 200,
        description: 'List of topics retrieved successfully',
        type: [TopicDto]
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getAllTopics(): Promise<TopicDto[]> {
        const topics = await this.topicService.getAll();
        return topics.map(topic => TopicMapper.toDto(topic));
    }

    @Get(':topicId')
    @ApiOperation({
        summary: 'Get a topic by ID'
    })
    @ApiParam({
        name: 'topicId',
        description: 'id of the topic',
        example: '098f6bcd-4621-3373-8ade-4e832627b4f6'
    })
    @ApiResponse({
        status: 200,
        description: 'Topic details retrieved successfully',
        type: TopicDto
    })
    @ApiResponse({
        status: 404,
        description: 'Topic not found - The specified topic ID does not exist'
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getTopicById(@Param('topicId') topicId: string): Promise<TopicDto> {
        const topic = await this.topicService.getById(topicId);
        return TopicMapper.toDto(topic);
    }

    @Delete(':topicId')
    @ApiOperation({
        summary: 'Delete a topic'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the topic to be deleted',
        example: '098f6bcd-4621-3373-8ade-4e832627b4f6'
    })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Topic deleted successfully' })
    @ApiResponse({
        status: 404,
        description: 'Topic not found - The specified topic ID does not exist'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized'
    })
    async deleteTopic(@Param('topicId') topicId: string): Promise<void> {
        await this.topicService.delete(topicId);
    }
}
