/**
 * Helper functions to extract standardized parameters from query DTOs
 */

import { BaseFindManyParams } from 'src/utils/dto/find.many.params.dto';
import { PaginationParams, SortOrder } from '../dto/pagination.dto';
import { BaseFilterParams } from '../dto/base.filter.dto';

/**
 * Extracts pagination parameters from query params
 * @param queryParams The query parameters object
 * @returns Standardized pagination parameters
 */
function extractPaginationParams(
  queryParams: BaseFindManyParams,
): PaginationParams {
  const { page, pageSize, orderBy, sortOrder } = queryParams;
  return {
    page: page || 1,
    pageSize: pageSize || 10,
    orderBy: orderBy || 'createdAt', // Default sort field
    sortOrder:
      sortOrder?.toUpperCase() === SortOrder.DESC
        ? SortOrder.DESC
        : SortOrder.ASC,
  };
}

/**
 * Extracts entity-specific filter parameters from query params
 * @param queryParams The query parameters object
 * @returns Entity-specific filter parameters
 */
function extractEntityFilterParams<
  T extends BaseFindManyParams,
  U extends BaseFilterParams,
>(queryParams: T): U {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { page, pageSize, orderBy, sortOrder, ...entitySpecificParams } =
    queryParams;

  return entitySpecificParams as unknown as U;
}

/**
 * Processes all query parameters and returns standardized objects for services
 * @param queryParams The query parameters object
 * @returns Object containing pagination, sort, and filter parameters
 */
export function processQueryParams<
  T extends BaseFindManyParams,
  U extends BaseFilterParams,
>(queryParams: T) {
  // Get entity-specific filter params
  const filterParams = extractEntityFilterParams<T, U>(queryParams);

  return {
    paginationParams: extractPaginationParams(queryParams),
    filterParams,
  };
}
