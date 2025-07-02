import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { FormsEmbedController } from './forms-embed.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FormsController, FormsEmbedController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {} 