import { forwardRef, Module } from '@nestjs/common';
import { IntentService } from './intent.service';
import { IntentController } from './intent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Intent, IntentSchema } from './intent.schema';
import { TopicModule } from '../topic/topic.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Intent.name, schema: IntentSchema }]),
    forwardRef(() => TopicModule),
  ],
  controllers: [IntentController],
  providers: [IntentService],
  exports: [IntentService],
})
export class IntentModule {}
