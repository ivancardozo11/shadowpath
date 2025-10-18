import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('API E2E', () => {
  let app: INestApplication<App>;

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

  describe('GET /gasPrice', () => {
    it('should return gas price', async () => {
      const response = await request(app.getHttpServer())
        .get('/gasPrice')
        .expect(200);

      expect(response.body).toHaveProperty('wei');
      expect(response.body).toHaveProperty('gwei');
      expect(response.body).toHaveProperty('timestamp');
      expect(typeof response.body.wei).toBe('string');
      expect(typeof response.body.gwei).toBe('string');
    });

    it('should respond fast on cached request', async () => {
      await request(app.getHttpServer()).get('/gasPrice');
      
      const start = Date.now();
      await request(app.getHttpServer()).get('/gasPrice');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(50);
    }, 10000);
  });

  describe('GET /return/:from/:to/:amount', () => {
    it('should calculate swap output', async () => {
      const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
      const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
      const amount = '1000000000000000000';

      const response = await request(app.getHttpServer())
        .get(`/return/${WETH}/${USDC}/${amount}`)
        .expect(200);

      expect(response.body).toHaveProperty('amountOut');
      expect(response.body.fromToken).toBe(WETH);
      expect(response.body.toToken).toBe(USDC);
      expect(response.body.amountIn).toBe(amount);
    }, 30000);

    it('should return 400 for invalid token address', async () => {
      const invalidToken = 'invalid';
      const validToken = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
      const amount = '1000000000000000000';

      await request(app.getHttpServer())
        .get(`/return/${invalidToken}/${validToken}/${amount}`)
        .expect(400);
    });
  });
});