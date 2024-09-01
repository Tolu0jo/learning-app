import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicDto } from './dto/topic.dto';
import { v4 as uuid } from 'uuid';
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
    return await this.prisma.topic.findMany();
  }

  async getTopicById(id: string) {
    return await this.prisma.topic.findUnique({
      where: { id },
    });
  }

  async getCompletedTopicsByUser(userId: string, subjectId: string) {
    const completedTopics = await this.prisma.topic.findMany({
      where: {
        subjectId,
        completions: {
          some: {
            userId,
          },
        },
      },
      include: {
        completions: {
          where: {
            userId,
          },
        },
      },
    });

    return completedTopics.map((topic) => ({
      id: topic.id,
      title: topic.title,
    }));
  }
}
