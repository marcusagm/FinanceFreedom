import { Test, TestingModule } from '@nestjs/testing';
import { SavingsGoalController } from './savings-goal.controller';

describe('SavingsGoalController', () => {
  let controller: SavingsGoalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavingsGoalController],
    }).compile();

    controller = module.get<SavingsGoalController>(SavingsGoalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
