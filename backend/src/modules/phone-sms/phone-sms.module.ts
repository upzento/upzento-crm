import { Module } from '@nestjs/common';
import { PhoneSmsService } from './phone-sms.service';
import { PhoneSmsController } from './phone-sms.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PhoneSmsController],
  providers: [PhoneSmsService],
  exports: [PhoneSmsService],
})
export class PhoneSmsModule {} 