import { Inject, Injectable } from '@nestjs/common';
import { GasPrice } from '../../domain/entities/gas-price.entity';
import type { IBlockchainPort } from '../../domain/ports/blockchain.port';
import { BLOCKCHAIN_PORT } from '../../domain/ports/blockchain.port';
import type { ICachePort } from '../../domain/ports/cache.port';
import { CACHE_PORT } from '../../domain/ports/cache.port';

@Injectable()
export class GetGasPriceUseCase {
  private readonly CACHE_KEY = 'gas_price';

  constructor(
    @Inject(BLOCKCHAIN_PORT) private readonly blockchain: IBlockchainPort,
    @Inject(CACHE_PORT) private readonly cache: ICachePort<GasPrice>,
  ) {}

  async execute(): Promise<GasPrice> {
    const cached = await this.cache.get(this.CACHE_KEY);
    if (cached) {
      return cached;
    }

    const gasPrice = await this.blockchain.getGasPrice();

    await this.cache.set(this.CACHE_KEY, gasPrice, 10);

    return gasPrice;
  }
}
