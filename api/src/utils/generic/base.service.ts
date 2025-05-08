import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  OptimisticLockVersionMismatchError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { PaginationParams } from '../dto/pagination.dto';
import { paginate, PaginationResponse } from '../paginator';
import { BaseFilterParams } from '../dto/base.filter.dto';

export abstract class BaseService<
  T extends BaseEntity,
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T>,
  FilterDto extends BaseFilterParams = BaseFilterParams,
> {
  protected readonly logger: Logger;

  constructor(protected readonly repository: Repository<T>) {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Create a single entity
   */
  async createOne(data: CreateDto, userId?: string): Promise<T> {
    const entity = this.repository.create(data);
    if (userId) {
      entity.createdBy = userId;
    }
    return this.repository.save(entity);
  }

  /**
   * Create multiple entities
   */
  async createMany(data: CreateDto[], userId?: string): Promise<T[]> {
    const entities = this.repository.create(data as DeepPartial<T>[]);
    if (userId) {
      entities.forEach((entity) => {
        entity.createdBy = userId;
      });
    }
    return this.repository.save(entities);
  }

  /**
   * Find an entity or create it if not found
   */
  async findOneOrCreate(
    where: FindOptionsWhere<T>,
    data: CreateDto,
    userId?: string,
  ): Promise<T> {
    const existing = await this.findOne(where, { withException: false });
    if (existing) return existing;
    return this.createOne({ ...data, ...where }, userId);
  }

  /**
   * Find a single entity or throw exception if withException is true
   */
  async findOne(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    options: {
      select?: FindOptionsSelect<T>;
      relations?: FindOptionsRelations<T>;
      includeDeleted?: boolean;
      withException?: boolean;
    } = {
      withException: true,
      includeDeleted: false,
    },
  ): Promise<T | null> {
    const { select, relations, includeDeleted, withException } = options;

    const findOptions: FindOneOptions<T> = {
      where,
      select,
      relations,
      withDeleted: includeDeleted,
    };

    const entity = await this.repository.findOne(findOptions);

    if ((!entity || entity === null) && withException) {
      throw new NotFoundException(`${this.repository.metadata.name} not found`);
    }
    return entity;
  }

  /**
   * Find all entities matching the conditions
   */
  async findAll(
    options: {
      where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
      select?: FindOptionsSelect<T>;
      relations?: FindOptionsRelations<T>;
      order?: FindOptionsOrder<T>;
      includeDeleted?: boolean;
    } = {},
  ): Promise<T[]> {
    const { where, select, relations, order, includeDeleted } = options;

    const findOptions: FindManyOptions<T> = {
      where,
      select,
      relations,
      order,
      withDeleted: includeDeleted,
    };

    return this.repository.find(findOptions);
  }

  /**
   * Find paginated entities with advanced filtering
   */
  async findAllPaginated(
    paginationParams: PaginationParams,
    options: {
      where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
      select?: FindOptionsSelect<T>;
      relations?: FindOptionsRelations<T>;
      filters?: FilterDto;
      includeDeleted?: boolean;
    } = {},
  ): Promise<PaginationResponse<T>> {
    const { where, select, relations, filters, includeDeleted } = options;

    const findOptions: FindManyOptions<T> = {
      where,
      select,
      relations,
      withDeleted: includeDeleted,
    };

    // Apply custom filtering if provided
    if (filters) {
      findOptions.where = this.applyFilters(
        filters,
        findOptions.where as FindOptionsWhere<T>,
      );
    }

    return paginate(this.repository, paginationParams, findOptions);
  }

  /**
   * Update a single entity
   */
  async updateOne(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    data: UpdateDto,
    options: {
      relations?: FindOptionsRelations<T>;
      userId?: string;
    } = {},
  ): Promise<T> {
    const { relations, userId } = options;

    const entity = await this.findOne(where, { relations });
    if (!entity)
      throw new NotFoundException(`${this.repository.metadata.name} not found`);

    if (userId) {
      data.updatedBy = userId;
    }

    const currentVersion = entity.version;

    Object.assign(entity, data);
    try {
      // Pass the version explicitly for optimistic locking
      return await this.repository.save({
        ...entity,
        version: currentVersion,
      });
    } catch (error) {
      if (error instanceof OptimisticLockVersionMismatchError) {
        this.logger.warn(
          `Optimistic lock version mismatch for ${this.repository.metadata.name} ID: ${entity.id}`,
        );
        throw new ConflictException(
          `The ${this.repository.metadata.name} was modified by another request. Please try again.`,
        );
      }
      throw error;
    }
  }

  /**
   * Update multiple entities
   */
  async updateMany(
    where: FindOptionsWhere<T>,
    data: UpdateDto,
    userId?: string,
  ): Promise<UpdateResult> {
    if (userId) {
      data.updatedBy = userId;
    }
    return this.repository.update(where, data as any);
  }

  /**
   * Soft delete a single entity
   */
  async deleteOne(
    where: FindOptionsWhere<T>,
    userId?: string,
  ): Promise<DeleteResult> {
    // If userId is provided, update the deletedBy field first
    if (userId) {
      await this.repository.update(where, { deletedBy: userId } as any);
    }
    return this.repository.softDelete(where);
  }

  /**
   * Soft delete multiple entities
   */
  async deleteMany(
    where: FindOptionsWhere<T>,
    userId?: string,
  ): Promise<DeleteResult> {
    // If userId is provided, update the deletedBy field first
    if (userId) {
      await this.repository.update(where, { deletedBy: userId } as any);
    }
    return this.repository.softDelete(where);
  }

  /**
   * Restore soft deleted entities
   */
  async restore(where: FindOptionsWhere<T>): Promise<UpdateResult> {
    return this.repository.restore(where);
  }

  /**
   * Soft delete on cascade (with related entities)
   */
  async deleteOneOnCascade(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    relations: string[] = [],
    userId?: string,
  ): Promise<T> {
    const relationsObject: FindOptionsRelations<T> = {};
    relations.forEach((rel) => {
      relationsObject[rel] = true;
    });
    const entity = await this.findOne(where, {
      relations: relationsObject,
      withException: true,
    });

    if (userId && entity) {
      entity.deletedBy = userId;
    }

    return this.repository.softRemove(entity!);
  }

  /**
   * Soft delete multiple entities on cascade
   */
  async deleteManyOnCascade(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    relations: string[] = [],
    userId?: string,
  ): Promise<T[]> {
    const relationsObject: FindOptionsRelations<T> = {};
    relations.forEach((rel) => {
      relationsObject[rel] = true;
    });
    const entities = await this.findAll({ where, relations: relationsObject });

    if (userId) {
      entities.forEach((entity) => {
        entity.deletedBy = userId;
      });
    }

    return this.repository.softRemove(entities);
  }

  /**
   * Count all entities
   */
  async countAll(includeDeleted = false): Promise<number> {
    const options = includeDeleted ? { withDeleted: true } : {};
    return this.repository.count(options);
  }

  /**
   * Count entities matching conditions
   */
  async count(
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    includeDeleted = false,
  ): Promise<number> {
    const options: FindManyOptions<T> = where ? { where } : {};
    if (includeDeleted) options.withDeleted = true;
    return this.repository.count(options);
  }

  /**
   * Apply filters to query options
   * Override this method in specific services for custom filtering
   */
  protected applyFilters(
    filters: FilterDto,
    currentWhere: FindOptionsWhere<T> = {},
  ): FindOptionsWhere<T> {
    // Default implementation - can be overridden in derived classes
    // This just returns the existing where clause
    let where = { ...currentWhere };

    if (filters.createdAfter || filters.createdBefore) {
      const createdAtConditions: Record<string, any> = {};

      if (filters.createdAfter) {
        createdAtConditions.moreThanOrEqual = filters.createdAfter;
      }

      if (filters.createdBefore) {
        createdAtConditions.lessThanOrEqual = filters.createdBefore;
      }

      where = { ...where, createdAt: createdAtConditions };
    }
    return where;
  }
}
