import { Controller, Get, Param } from '@nestjs/common';
import { CalculateSwapUseCase } from '../../application/use-cases/calculate-swap.usecase';

@Controller('return')
export class UniswapController {
  constructor(private readonly calculateSwapUseCase: CalculateSwapUseCase) {}

  @Get(':fromTokenAddress/:toTokenAddress/:amountIn')
  async getReturn(
    @Param('fromTokenAddress') from: string,
    @Param('toTokenAddress') to: string,
    @Param('amountIn') amountIn: string,
  ) {
    const result = await this.calculateSwapUseCase.execute(from, to, amountIn);
    return result.toJSON();
  }
}