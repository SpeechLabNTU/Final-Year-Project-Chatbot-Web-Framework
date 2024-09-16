import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { MongoExceptionFilter } from '../exception-filters/mongo-exception.filter';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';

@Controller('topic')
@UseFilters(MongoExceptionFilter)
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  async create(@Body() createTopicDto: CreateTopicDto) {
    return await this.topicService.create(createTopicDto);
  }

  @Get()
  async findAll() {
    return await this.topicService.findAll();
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    return await this.topicService.findOneByName(name);
  }

  @Delete(':name')
  async remove(@Param('name') name: string) {
    return await this.topicService.remove(name);
  }
}
