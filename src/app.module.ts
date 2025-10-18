import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { GasModule } from './infrastructure/modules/gas.module';
import { UniswapModule } from './infrastructure/modules/uniswap.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true, ttl: 10000 }),
    GasModule,
    UniswapModule,
  ],
})
export class AppModule {}