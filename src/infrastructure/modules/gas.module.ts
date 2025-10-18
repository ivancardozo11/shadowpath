import { Module } from '@nestjs/common';
import { GasController } from '../http/gas.controller';
import { GetGasPriceUseCase } from '../../application/use-cases/get-gas-price.usecase';
import { Web3BlockchainAdapter } from '../adapters/web3-blockchain.adapter';
import { CacheAdapter } from '../adapters/cache.adapter';
import { BLOCKCHAIN_PORT } from '../../domain/ports/blockchain.port';
import { CACHE_PORT } from '../../domain/ports/cache.port';

@Module({
  controllers: [GasController],
  providers: [
    GetGasPriceUseCase,
    {
      provide: BLOCKCHAIN_PORT,
      useClass: Web3BlockchainAdapter,
    },
    {
      provide: CACHE_PORT,
      useClass: CacheAdapter,
    },
  ],
  exports: [BLOCKCHAIN_PORT],
})
export class GasModule {}