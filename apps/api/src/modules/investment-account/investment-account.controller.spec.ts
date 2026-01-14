import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentAccountController } from './investment-account.controller';

describe('InvestmentAccountController', () => {
  let controller: InvestmentAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestmentAccountController],
    }).compile();

    controller = module.get<InvestmentAccountController>(InvestmentAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
