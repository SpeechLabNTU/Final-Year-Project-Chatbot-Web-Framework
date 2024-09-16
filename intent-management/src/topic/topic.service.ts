import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Topic, TopicDocument } from './topic.schema';
import { IntentService } from '../intent/intent.service';

@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
    @Inject(forwardRef(() => IntentService))
    private intentService: IntentService,
  ) {}

  async create(createTopicDto: CreateTopicDto) {
    return await this.topicModel.create(createTopicDto);
  }

  async findAll() {
    return await this.topicModel.find({});
  }

  async findOne(id: string) {
    return await this.topicModel.findById(id);
  }

  async findOneByName(name: string) {
    return await this.topicModel.findOne({ name: name });
  }

  async remove(name: string) {
    const topicDocument = await this.topicModel.findOne({ name: name });
    if (!topicDocument) {
      throw new UnprocessableEntityException('Topic not found.');
    }
    await this.intentService.removeIntentsByTopic(name);
    return await this.topicModel.findOneAndDelete({ name: name });
  }
}
