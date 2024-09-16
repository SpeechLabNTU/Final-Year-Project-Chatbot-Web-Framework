import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseFilters,
  Query,
  Patch,
} from '@nestjs/common';
import { MongoExceptionFilter } from '../exception-filters/mongo-exception.filter';
import { IntentService } from './intent.service';
import { CreateIntentDto } from './dto/create-intent.dto';
import { UpdateIntentDto } from './dto/update-intent.dto';

@Controller('intent')
@UseFilters(MongoExceptionFilter)
export class IntentController {
  constructor(private readonly intentService: IntentService) {}

  @Post()
  async create(@Body() createIntentDto: CreateIntentDto) {
    return await this.intentService.create(createIntentDto);
  }

  @Get()
  find(@Query() query) {
    return this.intentService.find(query);
  }

  @Delete()
  removeAll(@Query() query) {
    return this.intentService.removeIntentsByTopic(query.topic);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.intentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIntentDto: UpdateIntentDto) {
    return this.intentService.update(id, updateIntentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.intentService.remove(id);
  }
}
