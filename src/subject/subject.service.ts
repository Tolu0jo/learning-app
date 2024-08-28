import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/subject.dto';
import {v4 as uuid} from "uuid"



@Injectable()

export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubject(createSubjectDto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: {
        id:uuid(),
        title: createSubjectDto.title,
      },
    });
  }

  async getSubjects() {
    return this.prisma.subject.findMany({
      include: {
        topics: true,
      },
    });
  }

  async getSubjectById(id: string) {
    return this.prisma.subject.findUnique({
      where: { id },
      include: {
        topics: true,
      },
    });
  }
}
