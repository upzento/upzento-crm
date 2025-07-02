import { PartialType } from '@nestjs/mapped-types';
import { CreateGeneralSettingsDto } from './create-general-settings.dto';

export class UpdateGeneralSettingsDto extends PartialType(CreateGeneralSettingsDto) {} 