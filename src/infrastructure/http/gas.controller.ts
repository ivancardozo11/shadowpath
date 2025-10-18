import { Controller, Get } from '@nestjs/common';
import { GetGasPriceUseCase } from '../../application/use-cases/get-gas-price.usecase';


@Controller('gasPrice')
export class GasController {
  constructor(private readonly getGasPriceUseCase: GetGasPriceUseCase) {}

  @Get()
  async getGasPrice() {
    const gasPrice = await this.getGasPriceUseCase.execute();
    return gasPrice.toJSON();
  }
}