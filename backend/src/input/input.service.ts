import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Express } from 'express';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class InputService {
  private readonly logger = new Logger(InputService.name);

  async transcribeSpeech(file: Express.Multer.File): Promise<any> {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new HttpException('OPENAI_API_KEY is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('model', 'whisper-1');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            ...formData.getHeaders(),
          },
        },
      );
      this.logger.log('Speech-to-text transcription completed.');
      return response.data;
    } catch (error) {
      this.logger.error('Error in speech-to-text transcription:', error);
      throw new HttpException(
        'Error processing speech-to-text transcription',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async convertTextToSpeech(
    text: string,
    streaming: boolean = false,
    type: string = 'mp3',
  ): Promise<any> {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new HttpException('OPENAI_API_KEY is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const payload = {
      input: text,
      voice: process.env.TTS_VOICE || 'nova',
      model: process.env.TTS_MODEL || 'tts-1',
    };

    const url = streaming
      ? 'https://api.openai.com/v1/audio/speech?stream=true'
      : 'https://api.openai.com/v1/audio/speech';

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
          ...(streaming ? { 'Accept': `audio/${type}` } : {}),
        },
        responseType: streaming ? 'stream' : 'arraybuffer',
      });
      this.logger.log('Text-to-speech conversion completed.');
      return response.data;
    } catch (error) {
      this.logger.error('Error in text-to-speech conversion:', error);
      throw new HttpException('Error processing text-to-speech', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 