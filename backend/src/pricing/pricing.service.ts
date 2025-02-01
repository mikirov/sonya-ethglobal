import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ethers } from 'ethers';
import bn from 'bignumber.js'; // Importing bignumber.js for precision control

// Extend BigNumber's precision
@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name);

  constructor() {
    bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });
  }


  private async getPriceFromUniswapV2Pool(
    poolContract: ethers.Contract,
    poolAddress: string,
    blockNumber?: number,
  ): Promise<bn> {
    try {
      const reserves = await poolContract.getReserves({
        blockTag: blockNumber,
      });
      const reserves0 = new bn(reserves[0]).dividedBy(new bn(10).pow(18)); // divided by 10**6 to account for the 6 decimal places of USDT
      const reserves1 = new bn(reserves[1]).dividedBy(new bn(10).pow(18)); // divided by 10**6 to account for the 6 decimal places of USDT
      return reserves0.div(reserves1);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // in case of error, try fetching the latest block
    }
    try {
      const reserves = await poolContract.getReserves();
      const reserves0 = new bn(reserves[0]).div(new bn(10).pow(18)); // divided by 10**6 to account for the 6 decimal places of USDT
      const reserves1 = new bn(reserves[1]).div(new bn(10).pow(18)); // divided by 10**6 to account for the 6 decimal places of USDT
      return reserves0.div(reserves1);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch price for pool: ${poolAddress}`,
        error,
      );
    }
  }

  public async getPriceFromPool(
    provider: ethers.JsonRpcProvider,
    poolAddress: string,
    blockNumber?: number,
  ): Promise<bn> {
    const poolContract = new ethers.Contract(
      poolAddress,
      [
        'function getReserves() public view returns (uint128 _reserve0, uint128 _reserve1, uint32 _blockTimestampLast)',
      ],
      provider,
    );

    const price = await this.getPriceFromUniswapV2Pool(
      poolContract,
      poolAddress,
      blockNumber,
    );

    return price;
  }

}
