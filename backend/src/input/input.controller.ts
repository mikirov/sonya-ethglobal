import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import axios from 'axios';
import { config } from 'dotenv';
import { TextResponseDto } from './dto/text-response.dto';
import { TextRequestDto } from './dto/text-request.dto';
import { TtsRequestDto } from './dto/tts-request.dto';
import { TtsResponseDto } from './dto/tts-response.dto';

config(); // Load environment variables from .env

@ApiTags('Input')
@Controller('input')
export class InputController {
  private readonly logger = new Logger(InputController.name);

  /**
   * Existing endpoint for processing input text.
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
    const agentUrl = process.env.AGENT_URL;
    const agentId = process.env.AGENT_ID;

    if (!agentUrl || !agentId) {
      throw new HttpException(
        'AGENT_URL or AGENT_ID is not defined.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let responseText: string;

    try {
      // Forward the input to the agent's message endpoint
      const messageResponse = await fetch(`${agentUrl}/${agentId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      });

      if (!messageResponse.ok) {
        throw new HttpException(
          `Failed to process message. Status: ${messageResponse.status}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const messageData: any = await messageResponse.json();
      responseText = messageData[0]?.text;

      if (!responseText) {
        throw new HttpException('No text response received.', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      this.logger.log('Message response:', responseText);

      return {
        response: responseText,
      };
    } catch (error) {
      this.logger.error('Error processing input:', error);
      throw new HttpException(
        'Failed to process input.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    const { text } = body;
    if (!text) {
      throw new HttpException('No text provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        throw new HttpException('OPENAI_API_KEY is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Construct the request payload based on OpenAI's Text-to-Speech API documentation.
      // Adjust parameters such as "voice" and "model" as needed.
      const payload = {
        input: text,
        voice: process.env.TTS_VOICE || "nova", // Specify a default voice or load from .env
        model: process.env.TTS_MODEL || "tts-1", 
      };

      // Call OpenAI's text-to-speech API.
      const response = await axios.post('https://api.openai.com/v1/audio/speech', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        responseType: 'arraybuffer', // Get binary audio data
      });

      if (response.status !== 200) {
        throw new HttpException(`TTS API error: ${response.statusText}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Convert binary data to base64
      const audioBase64 = Buffer.from(response.data).toString('base64');

      this.logger.log('TTS processing completed.');

      return {
        audio: `data:audio/mpeg;base64,${audioBase64}`,
      };
    } catch (error) {
      this.logger.error('Error in text-to-speech processing:', error);
      throw new HttpException('Error processing text-to-speech', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
