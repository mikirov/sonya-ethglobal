import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
  Res,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { config } from 'dotenv';
import { TextResponseDto } from './dto/text-response.dto';
import { TextRequestDto } from './dto/text-request.dto';
import { TtsRequestDto } from './dto/tts-request.dto';
import { TtsResponseDto } from './dto/tts-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { InputService } from './input.service';

config(); // Load environment variables from .env

@ApiTags('Input')
@Controller('input')
export class InputController {
  private readonly logger = new Logger(InputController.name);

  constructor(private readonly inputService: InputService) {}

  /**
   * Updated endpoint for processing input text.
   */
  @ApiBearerAuth()
  @Post('text')
  @ApiResponse({
    status: 200,
    description: 'Input successfully processed by the agent.',
    type: TextResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error processing input.',
  })
  @ApiBody({ type: TextRequestDto, description: 'Process input DTO'})
  async processInput(@Body() processInputDto: TextRequestDto): Promise<TextResponseDto> {
    this.logger.log('Processing input:', processInputDto);
    const { input } = processInputDto;
    // Call the agent using the service
    const responseText = await this.inputService.callAgent(input);
    this.logger.log('Agent response:', responseText);
    return {
      response: responseText,
    };
  
  }

  /**
   * New endpoint for converting text to speech using OpenAI's TTS API.
   * This endpoint accepts text, sends it to the OpenAI text-to-speech API,
   * and returns the resulting audio as a base64-encoded data URI.
   */
  @ApiBearerAuth()
  @Post('tts-chatgpt')
  @ApiResponse({
    status: 200,
    description: 'Text processed and converted to speech.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error processing text-to-speech.',
  })
  @ApiBody({
    type: TtsRequestDto,
    description: 'Input text for TTS',
  })
  async textToSpeech(@Body() body: TtsRequestDto): Promise<TtsResponseDto> {
    const { text, type = 'mp3' } = body;
    if (!text) {
      throw new HttpException('No text provided', HttpStatus.BAD_REQUEST);
    }

    // Use the service to convert text to speech (non-streaming)
    const audioBuffer = await this.inputService.convertTextToSpeech(text, false, type);
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    this.logger.log('TTS processing completed.');
    return {
      audio: `data:audio/${type};base64,${audioBase64}`,
    };
  }

  /**
   * New endpoint for converting text to speech using OpenAI's TTS API.
   * This endpoint accepts text, sends it to the OpenAI text-to-speech API,
   * and streams the resulting audio data in chunks to the client.
   */
  @ApiBearerAuth()
  @Post('tts-chatgpt-stream')
  @ApiResponse({
    status: 200,
    description: 'Text processed and audio streamed for text-to-speech.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error processing text-to-speech streaming.',
  })
  @ApiBody({
    type: TtsRequestDto,
    description: 'Input text for TTS',
  })
  async streamTextToSpeech(@Body() body: TtsRequestDto, @Res() res: Response) {
    const { text, type = 'mp3' } = body;
    if (!text) {
      throw new HttpException('No text provided', HttpStatus.BAD_REQUEST);
    }
    try {
      const ttsStream = await this.inputService.convertTextToSpeech(text, true, type);
      res.setHeader('Content-Type', `audio/${type}`);
      ttsStream.pipe(res);
      this.logger.log('Streaming TTS audio to client.');
    } catch (error) {
      this.logger.error('Error in streaming text-to-speech processing:', error);
      throw new HttpException('Error processing text-to-speech streaming', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Updated endpoint for speech-to-text transcription.
   */
  @ApiBearerAuth()
  @Post('speech-to-text')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Audio transcribed to text.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error processing speech-to-text transcription.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async speechToText(@UploadedFile() file: Express.Multer.File): Promise<TextResponseDto> {
    if (!file) {
      throw new HttpException('No speech file provided', HttpStatus.BAD_REQUEST);
    }
    // Transcribe the speech to text
    const transcription = await this.inputService.transcribeSpeech(file);
    // Call the agent with the transcribed text
    const agentResponse = await this.inputService.callAgent(transcription.text);
    return {
      response: agentResponse,
    };
  }

  /**
   * Updated endpoint for speech-to-speech conversion.
   */
  @ApiBearerAuth()
  @Post('speech-to-speech')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Speech converted to speech.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error processing speech-to-speech conversion.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async speechToSpeech(@UploadedFile() file: Express.Multer.File): Promise<TtsResponseDto> {
    if (!file) {
      throw new HttpException('No speech file provided', HttpStatus.BAD_REQUEST);
    }

    // Transcribe the speech to text
    const transcription = await this.inputService.transcribeSpeech(file);
    // Call the agent with the transcribed text
    const agentResponse = await this.inputService.callAgent(transcription.text);

    // Convert the agent's response text to speech (non-streaming)
    const audioBuffer = await this.inputService.convertTextToSpeech(agentResponse, false);
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    return {
      audio: `data:audio/mpeg;base64,${audioBase64}`,
    };
  }

  /**
   * Updated endpoint for speech-to-speech streaming conversion.
   */
  @ApiBearerAuth()
  @Post('speech-to-speech-stream')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Speech converted to streamed speech.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error processing speech-to-speech streaming conversion.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async speechToSpeechStream(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: TtsRequestDto,
    @Res() res: Response,
    @Body() body: any,
  ): Promise<void> {
    const type = body.type || 'mp3';
    if (!file) {
      throw new HttpException('No speech file provided', HttpStatus.BAD_REQUEST);
    }

    try {
      // Transcribe the speech to text
      const transcription = await this.inputService.transcribeSpeech(file);
      // Call the agent with the transcribed text
      const agentResponse = await this.inputService.callAgent(transcription.text);

      // Convert the agent's response text back to speech in streaming mode
      const ttsStream = await this.inputService.convertTextToSpeech(agentResponse, true, type);

      // Set proper content type header for the streaming audio
      res.setHeader('Content-Type', `audio/${type}`);

      // Pipe the TTS stream to the client
      ttsStream.pipe(res);

      this.logger.log('Streaming speech-to-speech audio to client.');
    } catch (error) {
      this.logger.error('Error in speech-to-speech streaming conversion:', error);
      throw new HttpException('Error processing speech-to-speech streaming conversion', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
