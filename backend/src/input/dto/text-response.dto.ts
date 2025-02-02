import { ApiProperty } from "@nestjs/swagger";

export class TextResponseDto {
  @ApiProperty({
    description: 'Response from the agent.',
    example: 'Hello, how can I help you today?',
  })
  response: string;
}