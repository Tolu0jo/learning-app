import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CompletionService } from './completion.service';
import { CreateCompletionDto } from './dto/completion.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { request } from 'express';
import { AuthenticatedRequest } from 'src/utils/utils';
@Controller('completions')
@UseGuards(JwtAuthGuard)
export class CompletionController {
  constructor(private readonly completionService: CompletionService) {}

  @Post()
  @Roles(Role.TEACHER)
  @UseGuards(RolesGuard)
  async createCompletion(@Body() createCompletionDto: CreateCompletionDto) {
    return this.completionService.createCompletion(createCompletionDto);
  }

  @Get()
  async getCompletions() {
    return this.completionService.getCompletions();
  }

  @Get('rankings/:subjectId')
  async getLearnerRankings(@Param('subjectId') subjectId: string) {
    return this.completionService.getLearnerRankings(subjectId);
  }

  @Get('is-completed')
  @Roles(Role.LEARNER)
  @UseGuards(RolesGuard)
  async isTopicCompleted(
    @Query('topicId') topicId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ completed: boolean }> {
    const userId = req.user.id;
    const completed = await this.completionService.isTopicCompletedByUser(
      userId,
      topicId,
    );
    return { completed };
  }

  @Get('subject-progress')
  async getSubjectProgress(
    @Query('subjectId') subjectId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const { totalTopics, completedTopics } =
      await this.completionService.getCompletionCountForSubject(
        userId,
        subjectId,
      );
    return { totalTopics, completedTopics };
  }
}
