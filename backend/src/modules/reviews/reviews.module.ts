import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsEmbedController } from './reviews-embed.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewsController, ReviewsEmbedController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {} 