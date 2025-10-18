import { Module } from '@nestjs/common';
import { UniswapController } from '../http/uniswap.controller';
import { CalculateSwapUseCase } from '../../application/use-cases/calculate-swap.usecase';
import { UniswapCalculatorAdapter } from '../adapters/uniswap-calculator.adapter';
import { SWAP_CALCULATOR_PORT } from '../../domain/ports/swap-calculator.port';
import { GasModule } from './gas.module';

@Module({
  imports: [GasModule],
  controllers: [UniswapController],
  providers: [
    CalculateSwapUseCase,
    {
      provide: SWAP_CALCULATOR_PORT,
      useClass: UniswapCalculatorAdapter,
    },
  ],
})
export class UniswapModule {}