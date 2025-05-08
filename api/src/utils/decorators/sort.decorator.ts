import { applyDecorators } from '@nestjs/common/decorators';
import { ApiQuery } from '@nestjs/swagger';

export function Sort() {
  return applyDecorators(
    ApiQuery({ name: 'field', required: false }),
    ApiQuery({ name: 'direction', required: false }),
  );
}
