import { BaseService } from './base.service';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

import { PaginationResponse } from '../paginator';
import { BaseEntity } from './base.entity';
import { BaseFilterParams } from '../dto/base.filter.dto';
import { BaseFindManyParams } from '../dto/find.many.params.dto';
import { processQueryParams } from '../helpers/find.many.helper';

export abstract class BaseController<
  T extends BaseEntity,
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T>,
  FilterDto extends BaseFilterParams = BaseFilterParams,
  FindManyParams extends BaseFindManyParams = BaseFindManyParams,
> {
  constructor(
    private readonly service: BaseService<T, CreateDto, UpdateDto, FilterDto>,
  ) {}

  async create(createDto: CreateDto, userId?: string): Promise<T> {
    return await this.service.createOne(createDto, userId);
  }

  async findAll(queryParams: FindManyParams): Promise<PaginationResponse<T>> {
    const relations = this.getDefaultRelations();
    const select = this.getDefaultSelect();

    const { paginationParams, filterParams } = processQueryParams<
      FindManyParams,
      FilterDto
    >(queryParams);

    return await this.service.findAllPaginated(paginationParams, {
      relations,
      select,
      filters: filterParams,
    });
  }

  async findOne(id: string): Promise<T> {
    const relations = this.getDefaultRelations();
    const select = this.getDefaultSelect();
    const where: FindOptionsWhere<T> = { id } as FindOptionsWhere<T>;
    const entity = await this.service.findOne(where, {
      relations,
      select,
      withException: true,
    });
    return entity as T;
  }

  async update(id: string, updateDto: UpdateDto, userId?: string): Promise<T> {
    const relations = this.getDefaultRelations();

    const where: FindOptionsWhere<T> = { id } as FindOptionsWhere<T>;
    return await this.service.updateOne(where, updateDto, {
      relations,
      userId,
    });
  }

  async remove(id: string, userId?: string): Promise<DeleteResult> {
    const where: FindOptionsWhere<T> = { id } as FindOptionsWhere<T>;
    return await this.service.deleteOne(where, userId);
  }

  async restore(id: string): Promise<void> {
    const where: FindOptionsWhere<T> = { id } as FindOptionsWhere<T>;
    await this.service.restore(where);
  }

  /**
   * Get default relations for entity fetching
   * Override in child controllers as needed
   */
  protected getDefaultRelations(): FindOptionsRelations<T> {
    return {};
  }
  /**
   * Get default select fields for entity fetching
   * Override in child controllers as needed
   */
  protected getDefaultSelect(): FindOptionsSelect<T> {
    return {};
  }
}
