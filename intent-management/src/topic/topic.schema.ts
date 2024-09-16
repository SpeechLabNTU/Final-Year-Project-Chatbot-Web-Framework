import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TopicDocument = Topic & Document;

@Schema({
  timestamps: false,
  versionKey: false,
})
export class Topic {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
