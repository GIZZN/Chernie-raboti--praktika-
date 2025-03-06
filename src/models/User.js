export class User {
  constructor({id, email, name, surname, role = 'user'}) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.surname = surname;
    this.role = role;
    this.publishedItems = [];
    this.paidItems = [];
    this.achievements = [];
  }

  publishItem(item) {
    const publishedItem = {...item, isPublished: true, publishedBy: this.id};
    this.publishedItems.push(publishedItem);
    return publishedItem;
  }

  addPaidItem(item) {
    this.paidItems.push({
      ...item,
      purchaseDate: new Date().toISOString()
    });
  }

  addAchievement(achievement) {
    this.achievements.push({
      ...achievement,
      date: new Date().toISOString()
    });
  }
} 