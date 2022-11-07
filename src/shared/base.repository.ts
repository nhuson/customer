import { FilterQuery, Model, Document, Aggregate, PaginateResult, PaginateOptions, PopulateOptions } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { EventEmitter } from 'events';

export interface PaginateCustomOptions<T> extends PaginateOptions {
  offset?: number;
  page?: number;
  limit?: number;
}

export interface PaginateModel<T extends Document> extends Model<T> {
  paginate(query: FilterQuery<T>, options: PaginateCustomOptions<T>): Promise<PaginateResult<T>>;

  aggregatePaginate<R>(pipeline: Aggregate<any[]>, options: PaginateCustomOptions<T>): Promise<PaginateResult<R>>;
}

export class BaseRepository<T extends Document> extends EventEmitter {
  protected primaryKey = '_id';

  constructor(protected readonly model: PaginateModel<T>) {
    super();
    this.model = model;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  async create(entity: object, populates: string | string[] | PopulateOptions[] = []): Promise<T> {
    try {
      const model: any = await new this.model(entity).save();
      if (populates.length) {
        return model.populate(populates);
      }
      return model;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  async createOrUpdate(entity: object): Promise<T> {
    let model = await this.findOne({
      [this.primaryKey]: entity[this.primaryKey]
    });

    if (model === null) {
      model = await new this.model(entity).save();
    } else {
      await model.set(entity).save();
    }

    return model;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async createMany(entities: object[]): Promise<T[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.model.create(entities);
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  async update(params: { [key: string]: any } = {}, entity: object): Promise<T> {
    let model: any = await this.findOneOrFail(params);
    model = model.set(entity).save();

    return model;
  }

  async findById(id: string, populates: string | string[] | PopulateOptions[] = []): Promise<T> {
    const model: any = this.model.findById(id).lean();
    if (model && populates.length) {
      return model.populate(populates);
    }

    return model;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  async findOne(
    params: { [key: string]: any } = {},
    options: { [key: string]: any } = {},
    populates: string | string[] | PopulateOptions[] = []
  ): Promise<T> {
    const model: any = this.model.findOne(params as any, {}, options);
    if (model && populates.length) {
      return model.populate(populates);
    }

    return model;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  async find(params: object = {}, populates: string | string[] | PopulateOptions[] = []): Promise<T[]> {
    const models: any[] = await this.model.find(params);

    if (populates.length) {
      const newModels = models.map((model) => model.populate(populates));
      return newModels;
    }

    return models;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  async findOneOrFail(params: object, populates: string | string[] | PopulateOptions[] = []): Promise<T> {
    const model: T = await this.findOne(params);

    if (model === null) {
      throw new Error(`Model [${this.getModel().collection.name}] not found for query ${JSON.stringify(params)}`);
    }

    if (model && populates.length) {
      return model.populate(populates);
    }

    return model;
  }

  async findOrFail(id: string): Promise<T> {
    try {
      const model: T = await this.findById(id);

      if (model !== null) {
        return model;
      }

      throw new Error(`Model [${id}] not found`);
    } catch (e) {
      if (e.name !== undefined && e.name === 'CastError') {
        throw new BadRequestException(e.message);
      }

      throw e;
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  async paginate(query: object, options: PaginateOptions): Promise<PaginateResult<T>> {
    const dataOptions: PaginateOptions = {
      ...options,
      limit: +options.limit > 0 ? +options.limit : 20,
      offset: +options.offset > 0 ? +options.offset : 0
    };
    return this.model.paginate(query, dataOptions);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async count(params: object = {}): Promise<number> {
    const model: number = await this.model.count(params);
    return model;
  }

  async findAll(
    filter: { [key: string]: any } = {},
    options: { [key: string]: any } = {},
    limit = 0,
    sort: { [key: string]: any } = {},
    projection: { [key: string]: any } = {}
  ): Promise<Array<T>> {
    const query = this.model
      .find(filter as any, projection, options)
      .limit(limit)
      .sort(sort);
    return query.exec();
  }

  getModel(): PaginateModel<T> {
    return this.model;
  }

  async removeAll(filter: { [key: string]: any } = {}) {
    return this.model.deleteMany(filter as any);
  }

  async remove(filter: { [key: string]: any } = {}) {
    return this.model.deleteOne(filter as any);
  }
}
