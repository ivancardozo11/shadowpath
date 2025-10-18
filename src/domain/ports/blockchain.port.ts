import { GasPrice } from '../entities/gas-price.entity';

export interface IBlockchainPort {
    getGasPrice(): Promise<GasPrice>;
    getPairReserves(pairAddress: string): Promise<{ reserve0: bigint; reserve1: bigint }>;
    getPairToken0(pairAddress: string): Promise<string>;
}

export const BLOCKCHAIN_PORT = Symbol('BLOCKCHAIN_PORT');