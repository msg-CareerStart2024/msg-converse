import { CreateTopicDto } from './create-topic.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}
