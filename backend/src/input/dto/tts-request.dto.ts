import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export enum TtsType {
  MP3 = 'mp3',
  OPUS = 'opus',
}

export class TtsRequestDto {
  @ApiProperty({
    description: 'Input text to convert to speech.',
    example: 'Hello, how are you?',
  })
  text: string;

  @ApiPropertyOptional({
    description: 'Type of audio to return.',
    example: TtsType.MP3,
    enum: TtsType,
  })
  @IsOptional()
  @IsEnum(TtsType, {
    message: 'Invalid audio type. Must be either "mp3" or "opus".',
  })
  type?: TtsType;
}