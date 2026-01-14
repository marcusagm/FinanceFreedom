import { Test, TestingModule } from '@nestjs/testing';
import { SavingsGoalService } from './savings-goal.service';

describe('SavingsGoalService', () => {
  let service: SavingsGoalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavingsGoalService],
    }).compile();

    service = module.get<SavingsGoalService>(SavingsGoalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
