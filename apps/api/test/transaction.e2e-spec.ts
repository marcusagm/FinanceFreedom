import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('TransactionModule (e2e)', () => {
  let app: INestApplication;
  let accountId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create a fresh account for transaction tests
    const accountResponse = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'Transaction Integ Account',
        type: 'BANK',
        balance: 1000,
      });
    accountId = accountResponse.body.id;
  });

  afterAll(async () => {
    // Cleanup
    if (accountId) {
      await request(app.getHttpServer()).delete(`/accounts/${accountId}`);
    }
    await app.close();
  });

  let transactionId: string;

  it('POST /transactions (Should create transaction and update balance)', async () => {
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send({
        description: 'Test Income',
        amount: 100,
        type: 'INCOME', // 1000 + 100 = 1100
        date: new Date().toISOString(),
        accountId: accountId,
      })
      .expect(201);

    transactionId = response.body.id;

    // Verify Balance
    const accResponse = await request(app.getHttpServer()).get('/accounts');
    const account = accResponse.body.find((a) => a.id === accountId);
    expect(Number(account.balance)).toBe(1100);
  });

  it('PATCH /transactions/:id (Should update transaction and recalculate balance)', async () => {
    // Change to Expense of 50.
    // Old: Income 100 (Balance was 1100)
    // Revert Old: 1100 - 100 = 1000
    // Apply New: 1000 - 50 = 950
    await request(app.getHttpServer())
      .patch(`/transactions/${transactionId}`)
      .send({
        amount: 50,
        type: 'EXPENSE',
      })
      .expect(200);

    // Verify Balance
    const accResponse = await request(app.getHttpServer()).get('/accounts');
    const account = accResponse.body.find((a) => a.id === accountId);
    expect(Number(account.balance)).toBe(950);
  });

  it('DELETE /transactions/:id (Should delete transaction and revert balance)', async () => {
    // Delete Expense of 50
    // Current Balance 950.
    // Revert Expense: 950 + 50 = 1000.
    await request(app.getHttpServer())
      .delete(`/transactions/${transactionId}`)
      .expect(200);

    // Verify Balance
    const accResponse = await request(app.getHttpServer()).get('/accounts');
    const account = accResponse.body.find((a) => a.id === accountId);
    expect(Number(account.balance)).toBe(1000);
  });
});
