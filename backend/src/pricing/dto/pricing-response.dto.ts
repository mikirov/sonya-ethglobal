import { ApiProperty } from "@nestjs/swagger";

export class PriceResponseDto {
  @ApiProperty({
    description: 'Price of the product in USD.',
    example: 100,
  })
  price: string;
}