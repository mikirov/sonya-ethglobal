import { ApiProperty } from "@nestjs/swagger";

export class TtsRequestDto {
  @ApiProperty({
    description: 'Input text to convert to speech.',
    example: 'Hello, how are you?',
  })
  text: string;
}