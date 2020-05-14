export default class Task {
  constructor(data) {
    this.id = data[`id`];
    this.color = data[`color`];
    this.description = data[`description`] || ``;
    this.isArchive = Boolean(data[`is_archived`]);
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.dueDate = data[`due_date`] ? new Date(data[`due_date`]) : null;
    this.repeatingDays = data[`repeating_days`];
  }

  toRaw() {
    return {
      "id": this.id,
      "color": this.color,
      "description": this.description,
      "is_archived": this.isArchive,
      "is_favorite": this.isFavorite,
      "due_date": this.dueDate ? this.dueDate.toISOString() : null,
      "repeating_days": this.repeatingDays,
    };
  }

  static parseTask(data) {
    return new Task(data);
  }

  static parseTasks(data) {
    return data.map(Task.parseTask);
  }

  static clone(data) {
    return new Task(data.toRaw());
  }
}
