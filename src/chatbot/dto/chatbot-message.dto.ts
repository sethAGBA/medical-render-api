import { IsString } from 'class-validator';

export class ChatbotMessageDto {
  @IsString()
  message: string;
}
