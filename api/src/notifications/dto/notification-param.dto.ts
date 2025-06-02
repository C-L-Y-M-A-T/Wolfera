import { IsEnum, IsOptional } from 'class-validator';
import { PaginationParams } from 'src/utils/dto/pagination.dto';

export class GetNotificationsQueryDto extends PaginationParams {
  @IsEnum(['all', 'read', 'unread'])
  @IsOptional()
  filter: 'all' | 'read' | 'unread' = 'all';
}
