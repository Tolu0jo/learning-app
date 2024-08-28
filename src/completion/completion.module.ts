import { Module } from '@nestjs/common';
import { CompletionService } from './completion.service';
import { CompletionController } from './completion.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [CompletionService,PrismaService],
  controllers: [CompletionController]
})
export class CompletionModule {}
