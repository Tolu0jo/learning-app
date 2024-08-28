import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/topic.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Response } from 'express';
@Controller('topics')
@UseGuards(JwtAuthGuard)
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @Roles(Role.TEACHER)
  @UseGuards(RolesGuard)
  async createTopic(
    @Body() createTopicDto: CreateTopicDto,
    @Res() res: Response,
  ) {
    const topic = await this.topicService.createTopic(createTopicDto);
    return res.json({ message: 'Topic created successfully', topic });
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
