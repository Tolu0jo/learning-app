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
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/subject.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { AuthenticatedRequest } from 'src/utils/utils';

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

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async updateSubject(
    @Param('id') id: string,
    @Body() createSubjectDto: CreateSubjectDto,
    @Res() res: Response,
  ) {
    const subject = await this.subjectService.updateSubject(id,createSubjectDto);
    return res.json({ message: 'Subject created successfully', subject });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.LEARNER)
  async getSubjects(@Req() req:AuthenticatedRequest, @Res() res: Response,) {
    const subjects =await this.subjectService.getSubjectsWithUserProgress(req.user.id);
   return res.json(subjects)
  }


  @Get("/topics/learners")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async getSubjectWithTopicAndLearners(@Req() req:AuthenticatedRequest, @Res() res: Response,) {
    const subjects =await this.subjectService.getSubjectsWithCompletionCount();
   return res.json(subjects)
  }

  @Get(':id')
  async getSubjectById(@Param('id') id: string, @Res() res: Response) {
    return res.json(await this.subjectService.getSubjectById(id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async deleteSubject(@Param('id') id: string, @Res() res: Response) {
    return res.json(await this.subjectService.deleteSubject(id));
  }
}
