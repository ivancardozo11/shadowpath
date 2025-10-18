import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { SwapResult } from '../../domain/entities/swap-result.entity';
import type { ISwapCalculatorPort } from '../../domain/ports/swap-calculator.port';
import { SWAP_CALCULATOR_PORT } from '../../domain/ports/swap-calculator.port';

@Injectable()
export class CalculateSwapUseCase {
  constructor(
    @Inject(SWAP_CALCULATOR_PORT)
    private readonly calculator: ISwapCalculatorPort,
  ) {}

  async execute(
    fromToken: string,
    toToken: string,
    amountIn: string,
  ): Promise<SwapResult> {
    if (!this.isValidAddress(fromToken) || !this.isValidAddress(toToken)) {
      throw new BadRequestException('Invalid token address');
    }

    const amount = BigInt(amountIn);
    if (amount <= 0n) {
      throw new BadRequestException('Amount must be positive');
    }
    return this.calculator.calculateSwapOutput(fromToken, toToken, amount);
  }

  private isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}