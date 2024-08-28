import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/topic.dto';

@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  async createTopic(@Body() createTopicDto: CreateTopicDto) {
    return this.topicService.createTopic(createTopicDto);
  }

  @Get()
  async getTopics() {
    return this.topicService.getTopics();
  }

  @Get(':id')
  async getTopicById(@Param('id') id: string) {
    return this.topicService.getTopicById(id);
  }
}
