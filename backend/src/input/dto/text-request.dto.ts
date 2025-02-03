import { ApiProperty } from "@nestjs/swagger";

export class TextRequestDto {
  @ApiProperty({
    description: 'Input text to process.',
    example: 'Hello, how are you?',
  })
  input: string;
}