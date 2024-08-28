import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicDto } from './dto/topic.dto';
import uuid from 'uuid';
@Injectable()
export class TopicService {
  constructor(private readonly prisma: PrismaService) {}

  async createTopic(createTopicDto: CreateTopicDto) {
    return this.prisma.topic.create({
      data: {
        id: uuid(),
        title: createTopicDto.title,
        videoUrl: createTopicDto.videoUrl,
        description: createTopicDto.description,
        subjectId: createTopicDto.subjectId,
      },
    });
  }

  async getTopics() {
    return this.prisma.topic.findMany();
  }

  async getTopicById(id: string) {
    return this.prisma.topic.findUnique({
      where: { id },
    });
  }
}
