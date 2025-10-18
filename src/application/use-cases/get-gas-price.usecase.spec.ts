import { GetGasPriceUseCase } from './get-gas-price.usecase';
import type { IBlockchainPort } from '../../domain/ports/blockchain.port';
import { BLOCKCHAIN_PORT } from '../../domain/ports/blockchain.port';
import type { ICachePort } from '../../domain/ports/cache.port';
import { CACHE_PORT } from '../../domain/ports/cache.port';
import { GasPrice } from '../../domain/entities/gas-price.entity';

describe('GetGasPriceUseCase', () => {
  let useCase: GetGasPriceUseCase;
  let mockBlockchain: jest.Mocked<IBlockchainPort>;
  let mockCache: jest.Mocked<ICachePort<GasPrice>>;

  beforeEach(() => {
    mockBlockchain = {
      getGasPrice: jest.fn(),
      getPairReserves: jest.fn(),
      getPairToken0: jest.fn(),
    };

    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
    };

    useCase = new GetGasPriceUseCase(mockBlockchain, mockCache);
  });

  it('should return cached gas price if available', async () => {
    const cachedPrice = GasPrice.fromWei(10000000000n);
    mockCache.get.mockResolvedValue(cachedPrice);

    const result = await useCase.execute();

    expect(result).toBe(cachedPrice);
    expect(mockBlockchain.getGasPrice).not.toHaveBeenCalled();
  });

  it('should fetch from blockchain if cache is empty', async () => {
    mockCache.get.mockResolvedValue(null);
    const freshPrice = GasPrice.fromWei(12000000000n);
    mockBlockchain.getGasPrice.mockResolvedValue(freshPrice);

    const result = await useCase.execute();

    expect(result).toBe(freshPrice);
    expect(mockCache.set).toHaveBeenCalledWith('gas_price', freshPrice, 10);
  });
});