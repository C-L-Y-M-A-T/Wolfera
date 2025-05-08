import { FindManyOptions, FindOptionsOrder, Repository } from 'typeorm';
import { BaseEntity } from './generic/base.entity';
import { PaginationParams } from './dto/pagination.dto';

export interface PaginationResponse<T> {
  data: T[];
  count: number;
  total: number;
  page: number;
  pageSize: number;
}

export async function paginate<T extends BaseEntity>(
  repository: Repository<T>,
  paginationParams: PaginationParams,
  options: Omit<FindManyOptions<T>, 'skip' | 'take' | 'order'> = {},
): Promise<PaginationResponse<T>> {
  const { page = 1, pageSize = 10, orderBy, sortOrder } = paginationParams;
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const findOptions: FindManyOptions<T> = {
    ...options,
    skip,
    take,
  };

  if (orderBy) {
    // Ensure orderBy is a valid property of the entity
    // This runtime check complements any type-level checks
    const entityFields = repository.metadata.columns.map(
      (col) => col.propertyName,
    );
    if (!entityFields.includes(orderBy)) {
      // Either ignore invalid field or throw error
      console.warn(
        `Invalid orderBy field: ${orderBy}. Using default ordering.`,
      );
    } else {
      findOptions.order = {
        [orderBy]: sortOrder,
      } as FindOptionsOrder<T>;
    }
  }

  let data: T[] = [];
  let total = 0;

  try {
    [data, total] = await repository.findAndCount(findOptions);
  } catch (error: unknown) {
    // Log error details for debugging
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`Pagination query failed: ${errorMessage}`, error);
    throw new Error(`Failed to retrieve paginated results: ${errorMessage}`);
  }

  return {
    data,
    count: data.length,
    total,
    page,
    pageSize,
  };
}
