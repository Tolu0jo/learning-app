import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/topic.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('topics')
@UseGuards(JwtAuthGuard)
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @Roles(Role.TEACHER)
  @UseGuards(RolesGuard)
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
