import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/subject.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubject(createSubjectDto: CreateSubjectDto) {
    return await this.prisma.subject.create({
      data: {
        id: uuid(),
        title: createSubjectDto.title,
      },
    });
  }

  async getSubjects() {
    return await this.prisma.subject.findMany({
      include: {
        topics: true,
      },
    });
  }

  async getSubjectsWithCompletionCount() {
    const subjects = await this.prisma.subject.findMany({
      include: {
        completions: {
          select: {
            userId: true,
          },
          distinct: ['userId'],
        },
        topics: {
          select: {
            id: true,
          },
        },
      },
    });
  
    return subjects.map((subject) => ({
      id: subject.id,
      title: subject.title,
      userCount: subject.completions.length,
      topicCount: subject.topics.length,
    }));
  }
  
  async updateSubject(id: string, createSubjectDto: CreateSubjectDto) {
    return await this.prisma.subject.update({
      where: {
        id,
      },
      data: createSubjectDto,
    });
  }
  async getSubjectById(id: string) {
    return await this.prisma.subject.findUnique({
      where: { id },
      include: {
        topics: true,
      },
    });
  }

  async deleteSubject(id: string) {
    return await this.prisma.subject.delete({
      where: { id }
    });
  }


  async getSubjectsWithUserProgress(userId: string) {
    const subjects = await this.prisma.subject.findMany({
      include: {
        topics: {
          include: {
            completions: {
              where: {
                userId,
              },
            },
          },
        },
      },
    });

    return subjects.map((subject) => {
      const totalTopics = subject.topics.length;
      const completedTopics = subject.topics.filter(
        (topic) => topic.completions.length > 0,
      ).length;

      return {
        id: subject.id,
        title: subject.title,
        topicCount: totalTopics,
        completedTopicCount: completedTopics,
      };
    });
  }
}
