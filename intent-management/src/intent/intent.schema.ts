import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Topic } from '../topic/topic.schema';

export type IntentDocument = Intent & Document;

@Schema({
  timestamps: true,
})
export class Intent {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    ref: Topic.name,
    type: MongooseSchema,
  })
  topic: Topic;

  @Prop({
    required: true,
  })
  question: string;

  @Prop({
    required: true,
  })
  answer: string;

  @Prop()
  similarQuestions: string[];
}

export const IntentSchema = SchemaFactory.createForClass(Intent);
