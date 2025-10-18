import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3, { Contract } from 'web3';
import type { ISwapCalculatorPort } from '../../domain/ports/swap-calculator.port';
import { SwapResult } from '../../domain/entities/swap-result.entity';
import type { IBlockchainPort } from '../../domain/ports/blockchain.port';
import { BLOCKCHAIN_PORT } from '../../domain/ports/blockchain.port';
import { UNISWAP_V2_FACTORY, FACTORY_ABI } from '../config/constants';

// Constantes para mejorar legibilidad
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const UNISWAP_FEE_MULTIPLIER = 997n; // 0.3% fee = 997/1000
const FEE_DENOMINATOR = 1000n;

@Injectable()
export class UniswapCalculatorAdapter implements ISwapCalculatorPort {
  private readonly web3: Web3;
  private readonly factoryContract: Contract<typeof FACTORY_ABI>;

  constructor(
    private configService: ConfigService,
    @Inject(BLOCKCHAIN_PORT) private blockchain: IBlockchainPort,
  ) {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    this.web3 = new Web3(rpcUrl);
    this.factoryContract = new this.web3.eth.Contract(
      FACTORY_ABI,
      UNISWAP_V2_FACTORY,
    );
  }

  async getPairAddress(tokenA: string, tokenB: string): Promise<string> {
    const pairAddress = await this.factoryContract.methods
      .getPair(tokenA, tokenB)
      .call() as string;

    if (this.isZeroAddress(pairAddress)) {
      throw new BadRequestException('Pair does not exist');
    }

    return pairAddress;
  }

  private isZeroAddress(address: string): boolean {
    return address === ZERO_ADDRESS;
  }

  async calculateSwapOutput(
    fromToken: string,
    toToken: string,
    amountIn: bigint,
  ): Promise<SwapResult> {
    const pairAddress = await this.getPairAddress(fromToken, toToken);
    const { reserveIn, reserveOut } = await this.getReservesForTokens(
      fromToken,
      pairAddress,
    );
    const amountOut = this.calculateAmountOut(amountIn, reserveIn, reserveOut);

    return new SwapResult(fromToken, toToken, amountIn, amountOut, pairAddress);
  }

  private async getReservesForTokens(
    fromToken: string,
    pairAddress: string,
  ): Promise<{ reserveIn: bigint; reserveOut: bigint }> {
    const { reserve0, reserve1 } = await this.blockchain.getPairReserves(
      pairAddress,
    );
    const token0 = await this.blockchain.getPairToken0(pairAddress);
    const isFromToken0 = this.isToken0(fromToken, token0);

    return {
      reserveIn: isFromToken0 ? reserve0 : reserve1,
      reserveOut: isFromToken0 ? reserve1 : reserve0,
    };
  }

  private isToken0(token: string, token0: string): boolean {
    return token.toLowerCase() === token0;
  }

  /**
   * Fórmula de Uniswap V2 con fee de 0.3%
   * amountOut = (amountIn * 997 * reserveOut) / (reserveIn * 1000 + amountIn * 997)
   */
  private calculateAmountOut(
    amountIn: bigint,
    reserveIn: bigint,
    reserveOut: bigint,
  ): bigint {
    const amountInWithFee = amountIn * UNISWAP_FEE_MULTIPLIER;
    const numerator = amountInWithFee * reserveOut;
    const denominator = reserveIn * FEE_DENOMINATOR + amountInWithFee;
    return numerator / denominator;
  }
}