import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widgets.controller';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    ChatController,
    WidgetsController,
    WhatsAppController
  ],
  providers: [
    ChatService,
    WidgetsService,
    WhatsAppService
  ],
  exports: [
    ChatService,
    WidgetsService,
    WhatsAppService
  ],
})
export class ChatModule {} 