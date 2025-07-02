import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FormFieldResponseDto {
  @IsString()
  fieldId: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}

export class CreateSubmissionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldResponseDto)
  responses: FormFieldResponseDto[];

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
