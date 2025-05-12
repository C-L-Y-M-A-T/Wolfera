import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function BaseFilter() {
  return applyDecorators(
    ApiQuery({ name: 'search', required: false }),
    ApiQuery({ name: 'isActive', required: false }),
    ApiQuery({ name: 'withDeleted', required: false }),
    ApiQuery({ name: 'createdAfter', required: false }),
    ApiQuery({ name: 'createdBefore', required: false }),
  );
}
