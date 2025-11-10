import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotMessageDto } from './dto/chatbot-message.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  handleMessage(@Body() chatbotMessageDto: ChatbotMessageDto) {
    return this.chatbotService.respondToMessage(chatbotMessageDto.message);
  }
}
