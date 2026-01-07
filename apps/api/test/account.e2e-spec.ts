import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AccountModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let createdAccountId: string;

  it('/accounts (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'Integration Test Account',
        type: 'WALLET',
        balance: 1000,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Integration Test Account');
    expect(Number(response.body.balance)).toBe(1000);
    createdAccountId = response.body.id;
  });

  it('/accounts (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/accounts')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    const account = response.body.find((a) => a.id === createdAccountId);
    expect(account).toBeDefined();
  });

  it('/accounts/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/accounts/${createdAccountId}`)
      .expect(200);

    // Verify it's gone
    const response = await request(app.getHttpServer())
      .get('/accounts')
      .expect(200);

    const account = response.body.find((a) => a.id === createdAccountId);
    expect(account).toBeUndefined();
  });
});
