import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

/**
 * Base filter parameters
 * Extend this class to create entity-specific filters
 */
export class BaseFilterParams {
  @ApiPropertyOptional({ description: 'Search term to filter results' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Include soft-deleted records',
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  withDeleted?: boolean = false;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by creation date range (start)' })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }: TransformFnParams) => {
    if (typeof value !== 'string') return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  })
  createdAfter?: Date;

  @ApiPropertyOptional({ description: 'Filter by creation date range (end)' })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }: TransformFnParams) => {
    if (typeof value !== 'string') return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  })
  createdBefore?: Date;
}
