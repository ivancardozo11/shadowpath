import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Web3 from "web3";
import { IBlockchainPort } from "../../domain/ports/blockchain.port";
import { GasPrice } from "../../domain/entities/gas-price.entity";
import { PAIR_ABI } from "../config/constants";

@Injectable()
export class Web3BlockchainAdapter implements IBlockchainPort {
  private web3: Web3;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    this.web3 = new Web3(rpcUrl);
  }

  async getGasPrice(): Promise<GasPrice> {
    const gasPriceWei = await this.web3.eth.getGasPrice();
    return GasPrice.fromWei(BigInt(gasPriceWei));
  }

  async getPairReserves(pairAddress: string) {
    const contract = new this.web3.eth.Contract(PAIR_ABI, pairAddress);
    const reserves = await contract.methods.getReserves().call() as {
      reserve0: string;
      reserve1: string;
    };
    
    return {
      reserve0: BigInt(reserves.reserve0),
      reserve1: BigInt(reserves.reserve1),
    };
  }

  async getPairToken0(pairAddress: string): Promise<string> {
    const contract = new this.web3.eth.Contract(PAIR_ABI, pairAddress);
    const token0 = await contract.methods.token0().call() as string;
    return token0.toLowerCase();
  }
}