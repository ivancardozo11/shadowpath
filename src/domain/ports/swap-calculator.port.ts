import { SwapResult } from '../entities/swap-result.entity';

export interface ISwapCalculatorPort {
    getPairAddress(tokenA: string, tokenB: string): Promise<string>;
    calculateSwapOutput(fromToken: string, toToken: string, amountIn: bigint): Promise<SwapResult>;
}

export const SWAP_CALCULATOR_PORT = Symbol('SWAP_CALCULATOR_PORT');