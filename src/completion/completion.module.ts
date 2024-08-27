import { Module } from '@nestjs/common';
import { CompletionService } from './completion.service';
import { CompletionController } from './completion.controller';

@Module({
  providers: [CompletionService],
  controllers: [CompletionController]
})
export class CompletionModule {}
