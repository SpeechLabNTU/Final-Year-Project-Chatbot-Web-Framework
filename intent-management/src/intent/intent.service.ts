import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateIntentDto } from './dto/create-intent.dto';
import { UpdateIntentDto } from './dto/update-intent.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Intent, IntentDocument } from './intent.schema';
import { TopicService } from '../topic/topic.service';

@Injectable()
export class IntentService {
  constructor(
    @InjectModel(Intent.name) private intentModel: Model<IntentDocument>,
    @Inject(forwardRef(() => TopicService))
    private topicService: TopicService,
  ) {}

  async create(createIntentDto: CreateIntentDto) {
    const topicDocument = await this.topicService.findOneByName(
      createIntentDto.topic,
    );
    if (!topicDocument) {
      throw new UnprocessableEntityException('Topic not found.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { topic, ...payload } = createIntentDto;
    return this.intentModel.create({ ...payload, topic: topicDocument });
  }

  async find(query: any) {
    if (query.topic) {
      query.topic = await this.topicService.findOneByName(query.topic);
    }
    return await this.intentModel.find(query);
  }

  async findOne(id: string) {
    return await this.intentModel.findById(id);
  }

  async update(id: string, updateIntentDto: UpdateIntentDto) {
    const { topic, ...payload } = updateIntentDto as any;

    if (topic) {
      const topicDocument = await this.topicService.findOneByName(
        updateIntentDto.topic,
      );
      if (!topicDocument) {
        throw new UnprocessableEntityException('Topic not found.');
      }
      payload.topic = topicDocument;
    }

    return await this.intentModel.findByIdAndUpdate(id, payload, { new: true });
  }

  async remove(id: string) {
    return await this.intentModel.findByIdAndDelete(id);
  }

  async removeIntentsByTopic(topic: string) {
    return await this.intentModel.deleteMany({ 'topic.name': topic });
  }
}
