import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatbotService {
  respondToMessage(message: string): string {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes('bonjour')) {
      return 'Bonjour! Comment puis-je vous aider?';
    } else {
      return 'Je ne comprends pas. Pouvez-vous reformuler?';
    }
  }
}
