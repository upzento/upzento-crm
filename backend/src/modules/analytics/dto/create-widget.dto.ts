import { 
  IsString, 
  IsEnum, 
  IsUUID,
  IsObject
} from 'class-validator';

export enum WidgetType {
  BAR_CHART = 'BAR_CHART',
  LINE_CHART = 'LINE_CHART',
  PIE_CHART = 'PIE_CHART',
  AREA_CHART = 'AREA_CHART',
  TABLE = 'TABLE',
  METRIC = 'METRIC',
  FUNNEL = 'FUNNEL',
  HEATMAP = 'HEATMAP',
  MAP = 'MAP',
  CUSTOM = 'CUSTOM',
}

export class CreateWidgetDto {
  @IsString()
  name: string;

  @IsEnum(WidgetType)
  type: WidgetType;

  @IsObject()
  settings: Record<string, any>;

  @IsObject()
  position: Record<string, any>;

  @IsObject()
  size: Record<string, any>;

  @IsUUID()
  datasetId: string;

  @IsUUID()
  dashboardId: string;
} 
