import { Test, TestingModule } from '@nestjs/testing';
import { IntentController } from './intent.controller';
import { IntentService } from './intent.service';

describe('IntentController', () => {
  let controller: IntentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntentController],
      providers: [IntentService],
    }).compile();

    controller = module.get<IntentController>(IntentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
