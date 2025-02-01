import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { ethers } from 'ethers';

@ApiTags('Pricing')
@Controller(':network/pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('sonya-virtuals-price')
  @ApiOperation({
    summary: 'Get the Sonya AI (SONYA) to Virtuals Token price on Base',
  })
  @ApiResponse({
    status: 200,
    description: 'The SONYA price in virtuals tokens',
  })
  @ApiBadRequestResponse({
    description: 'Invalid network name.',
  })
  async getSonyaPriceInVirtuals(
  ): Promise<any> {
    if(!process.env.RPC_URL || !process.env.TOKEN_POOL_ADDRESS) {
      throw new Error('Missing RPC_URL or TOKEN_POOL_ADDRESS in the environment');
    }
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    return this.pricingService.getPriceFromPool(provider, process.env.TOKEN_POOL_ADDRESS); // Call the service to get the HST price in USD
  }
}
