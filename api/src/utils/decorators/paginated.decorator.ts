import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function Paginated() {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false }),
    ApiQuery({ name: 'pageSize', required: false }),
    ApiQuery({ name: 'orderBy', required: false }),
    ApiQuery({ name: 'sortOrder', required: false }),
  );
}
