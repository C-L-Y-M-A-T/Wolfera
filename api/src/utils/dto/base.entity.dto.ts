import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsUUID } from 'class-validator';

/**
 * Base DTO with common entity fields
 * Useful for response serialization
 */
export class BaseEntityDto {
  @ApiProperty({ description: 'Entity ID' })
  @IsUUID('4')
  id: string;

  @ApiProperty({ description: 'Creation date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @ApiProperty({ description: 'Last update date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;

  @ApiPropertyOptional({ description: 'Deletion date (if soft deleted)' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date;

  @ApiPropertyOptional({ description: 'Entity active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'User ID who created the entity' })
  @IsOptional()
  @IsUUID('4')
  createdBy?: string;

  @ApiPropertyOptional({ description: 'User ID who last updated the entity' })
  @IsOptional()
  @IsUUID('4')
  updatedBy?: string;

  @ApiPropertyOptional({ description: 'User ID who deleted the entity' })
  @IsOptional()
  @IsUUID('4')
  deletedBy?: string;
}
