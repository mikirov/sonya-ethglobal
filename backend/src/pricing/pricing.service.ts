import {
  Injectable,
  BadRequestException,
  Logger,
  // Logger,
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
    poolAddress: string
  ): Promise<bn> {
    try {
      this.logger.log('Fetching latest block');
      const reserves = await poolContract.getReserves();
      this.logger.log(`Reserves: ${reserves}`);
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
    virtualsUSDPoolAddress: string,
  ): Promise<bn> {
    const poolContract = new ethers.Contract(
      poolAddress,
      [
        'function getReserves() external view returns (uint256, uint256)',
      ],
      provider,
    );

    const priceInVirtuals: bn = await this.getPriceFromUniswapV2Pool(
      poolContract,
      poolAddress,
    );


    const virtualsPoolContract = new ethers.Contract(
      virtualsUSDPoolAddress,
      [
        'function slot0() public view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
      ],
      provider,
    );
    const priceVirtualsToUSD = await this.getUniswapV3PriceFromPool(
      virtualsPoolContract, virtualsUSDPoolAddress)

    return priceInVirtuals.multipliedBy(priceVirtualsToUSD);

  }

  private calculatePriceFromSqrtPrice(sqrtPriceX96: bn): bn {
    return sqrtPriceX96.dividedBy(new bn(2).pow(96)).pow(2);
  }

  private async getUniswapV3PriceFromPool(
    poolContract: ethers.Contract,
    poolAddress: string,
  ): Promise<bn> {
    try {
      const slot0 = await poolContract.slot0();
      this.logger.log(`Slot0: ${slot0}`);
      const price = new bn(slot0[0]);
      return this.calculatePriceFromSqrtPrice(price);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch price for pool: ${poolAddress}`,
        error,
      );
    }
  }

}
