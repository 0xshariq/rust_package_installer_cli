import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('generate')
  async generate(@Body('prompt') prompt: string) {
    return { output: await this.geminiService.generateContent(prompt) };
  }
}
