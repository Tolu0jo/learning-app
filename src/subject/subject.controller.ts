import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/subject.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('subjects')
@UseGuards(JwtAuthGuard)
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @Roles(Role.TEACHER)
  @UseGuards(RolesGuard)
  async createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.createSubject(createSubjectDto);
  }

  @Get()
  async getSubjects() {
    return this.subjectService.getSubjects();
  }

  @Get(':id')
  async getSubjectById(@Param('id') id: string) {
    return this.subjectService.getSubjectById(id);
  }
}
