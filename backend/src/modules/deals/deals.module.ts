import { Module } from '@nestjs/common';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { PipelinesService } from './pipelines.service';
import { PipelinesController } from './pipelines.controller';
import { StagesService } from './stages.service';
import { StagesController } from './stages.controller';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    DealsController,
    PipelinesController,
    StagesController,
    NotesController
  ],
  providers: [
    DealsService,
    PipelinesService,
    StagesService,
    NotesService
  ],
  exports: [
    DealsService,
    PipelinesService,
    StagesService,
    NotesService
  ],
})
export class DealsModule {} 