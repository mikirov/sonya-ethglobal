import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { ethers } from 'ethers';
import { PriceResponseDto } from './dto/pricing-response.dto';

@ApiTags('Pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('sonya-usd')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the Sonya AI (SONYA) to Virtuals Token price on Base',
  })
  @ApiResponse({
    status: 200,
    description: 'The SONYA price in virtuals tokens',
    type: PriceResponseDto,
  })
  async getSonyaPriceInVirtuals(): Promise<PriceResponseDto> {
    if(!process.env.RPC_URL || !process.env.TOKEN_POOL_ADDRESS || !process.env.VIRTUALS_POOL_ADDRESS) {
      throw new Error('Missing RPC_URL or TOKEN_POOL_ADDRESS or VIRTUALS_POOL_ADDRESS in the environment');
    }
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    return {
      price: (await this.pricingService.getPriceFromPool(provider, process.env.TOKEN_POOL_ADDRESS, process.env.VIRTUALS_POOL_ADDRESS)).toString(),
    };
  }
}
