import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompletionDto } from './dto/completion.dto';
import { v4 as uuid } from 'uuid';
@Injectable()
export class CompletionService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompletion(
    createCompletionDto: CreateCompletionDto,
    userId: string,
  ) {
    return this.prisma.completion.create({
      data: {
        id: uuid(),
        userId,
        topicId: createCompletionDto.topicId,
        subjectId: createCompletionDto.subjectId,
      },
    });
  }

  async getCompletions() {
    return this.prisma.completion.findMany({
      include: {
        user: true,
        topic: true,
        subject: true,
      },
    });
  }

  async getLearnerRankings(subjectId: string) {
    const totalTopics = await this.prisma.topic.count({
      where: { subjectId },
    });

    const completionCounts = await this.prisma.completion.groupBy({
      by: ['userId'],
      where: {
        subjectId: subjectId,
      },
      _count: {
        topicId: true,
      },
      orderBy: {
        _count: {
          topicId: 'desc',
        },
      },
    });

    const rankings = await Promise.all(
      completionCounts.map(async (completion) => {
        const user = await this.prisma.user.findUnique({
          where: { id: completion.userId },
        });
        delete user.password_hash;
        return {
          name: user.name,
          completedTopics: completion._count.topicId,
          totalTopics,
        };
      }),
    );

    return { rankings };
  }

  async isTopicCompletedByUser(
    userId: string,
    topicId: string,
  ): Promise<boolean> {
    const completion = await this.prisma.completion.findFirst({
      where: {
        userId: userId,
        topicId: topicId,
      },
    });

    return !!completion;
  }

  async getCompletionCountForSubject(userId: string, subjectId: string) {
    const totalTopics = await this.prisma.topic.count({
      where: { subjectId },
    });

    const completedTopics = await this.prisma.completion.count({
      where: {
        userId,
        subjectId,
      },
    });

    return {
      totalTopics,
      completedTopics,
    };
  }
}
