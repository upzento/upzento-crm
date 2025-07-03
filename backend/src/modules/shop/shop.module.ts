import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { ShopEmbedController } from './shop-embed.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShopController, ShopEmbedController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {} 