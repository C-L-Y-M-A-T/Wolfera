import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterParams } from './base.filter.dto';

/**
 * Unified query parameters for all entities
 * This combines pagination, sorting, and base filtering in a single DTO
 * to avoid property conflicts when using validation pipe
 */
export class BaseFindManyParams extends BaseFilterParams {
  // Pagination Parameters
  @ApiPropertyOptional({ example: 1, description: 'Page number (default: 1)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items per page (default: 10)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;

  @ApiPropertyOptional({
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({
    enum: ['ASC', 'DESC'],
    example: 'ASC',
    description: 'Sort order (ASC or DESC)',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: string = 'ASC';
}
