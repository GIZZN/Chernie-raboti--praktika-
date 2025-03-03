export class Cart {
  constructor() {
    this.items = [];
    this.prices = {};
  }

  addItem(item, quantity = 1) {
    const existingItem = this.items.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({...item, quantity});
    }
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
  }

  updateQuantity(itemId, quantity) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      const price = this.prices[item.text] || item.price;
      return total + (price * item.quantity);
    }, 0);
  }

  clear() {
    this.items = [];
  }
} 