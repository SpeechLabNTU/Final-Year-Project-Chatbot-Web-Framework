import { forwardRef, Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Topic, TopicSchema } from './topic.schema';
import { IntentModule } from '../intent/intent.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }]),
    forwardRef(() => IntentModule),
  ],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
