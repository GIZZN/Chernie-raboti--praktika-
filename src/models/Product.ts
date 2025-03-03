import { BaseModel } from './BaseModel';

export interface IProduct extends BaseModel {
  text: string;
  price: number;
  img: string;
  detailImg?: string;
  description?: string;
  category?: string;
  specifications?: Record<string, any>;
  isPublished?: boolean;
}

export class Product extends BaseModel implements IProduct {
  text: string;
  price: number;
  img: string;
  detailImg?: string;
  description?: string;
  category?: string;
  specifications?: Record<string, any>;
  isPublished: boolean;
  isFavorite: boolean;
  inCart: boolean;

  constructor(data: Partial<IProduct>) {
    super(data);
    this.text = data.text || '';
    this.price = data.price || 0;
    this.img = data.img || '';
    this.detailImg = data.detailImg;
    this.description = data.description;
    this.category = data.category;
    this.specifications = data.specifications || {};
    this.isPublished = data.isPublished || false;
    this.isFavorite = false;
    this.inCart = false;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      text: this.text,
      price: this.price,
      img: this.img,
      detailImg: this.detailImg,
      description: this.description,
      category: this.category,
      specifications: this.specifications,
      isPublished: this.isPublished,
      isFavorite: this.isFavorite,
      inCart: this.inCart
    };
  }
} 