export class Product {
  constructor({id, text, price, img, detailImg, description, category, specifications = {}, isPublished = false}) {
    this.id = id;
    this.text = text;
    this.price = price;
    this.img = img;
    this.detailImg = detailImg;
    this.description = description;
    this.category = category;
    this.specifications = specifications;
    this.isPublished = isPublished;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  updatePrice(newPrice) {
    this.price = newPrice;
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      text: this.text,
      price: this.price,
      img: this.img,
      detailImg: this.detailImg,
      description: this.description,
      category: this.category,
      specifications: this.specifications,
      isPublished: this.isPublished,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 