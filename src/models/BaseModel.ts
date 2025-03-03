import { nanoid } from 'nanoid';

export abstract class BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<BaseModel>) {
    this.id = data.id || nanoid();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  update(data: Partial<this>) {
    Object.assign(this, data);
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 