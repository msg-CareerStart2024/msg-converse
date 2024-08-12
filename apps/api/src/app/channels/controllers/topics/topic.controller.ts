import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

import { TopicDto } from '../../dto/topics/topic.dto';
import { TopicMapper } from '../../mapper/topic.mapper';
import { TopicService } from '../../services/topics/topic.service';

@ApiTags('Topics')
@ApiBearerAuth()
@Controller('topics')
export class TopicController {
    constructor(private readonly topicService: TopicService) {}

    @Get()
    @ApiOperation({
        summary: 'Get all available topics',
        description: 'Retrieve a list of all available topics for creating/updating a channel.'
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved topics',
        type: [TopicDto]
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.'
    })
    async getAllTopics(): Promise<TopicDto[]> {
        const topics = await this.topicService.getAll();
        return topics.map(topic => TopicMapper.toDto(topic));
    }
}
