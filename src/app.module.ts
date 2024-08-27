import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SubjectModule } from './subject/subject.module';
import { TopicModule } from './topic/topic.module';
import { CompletionModule } from './completion/completion.module';

@Module({
  imports: [UserModule, SubjectModule, TopicModule, CompletionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
