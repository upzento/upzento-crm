import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';




export class UpdatePlanDto extends PartialType(CreatePlanDto) {}
