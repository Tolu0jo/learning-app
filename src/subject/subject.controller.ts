import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/subject.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('subjects')
@UseGuards(JwtAuthGuard)
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async createSubject(
    @Body() createSubjectDto: CreateSubjectDto,
    @Res() res: Response,
  ) {
    const subject = await this.subjectService.createSubject(createSubjectDto);
    return res.json({ message: 'Subject created successfully', subject });
  }

  @Get()
  async getSubjects() {
    return await this.subjectService.getSubjects();
  }

  @Get(':id')
  async getSubjectById(@Param('id') id: string) {
    return await this.subjectService.getSubjectById(id);
  }
}
