const { Task } = require('./task');

class TaskStore {
  constructor() {
    this.tasks = new Map();
  }

  add(taskData) {
    const task = new Task(taskData);
    this.tasks.set(task.id, task);
    return task;
  }

  get(id) {
    return this.tasks.get(id);
  }

  getAll() {
    return Array.from(this.tasks.values()).map(task => task.toJSON());
  }

  update(id, updates) {
    const task = this.tasks.get(id);
    if (!task) {
      return null;
    }
    
    Object.keys(updates).forEach(key => {
      if (key !== 'id') {
        task[key] = updates[key];
      }
    });
    
    return task;
  }

  delete(id) {
    return this.tasks.delete(id);
  }

  has(id) {
    return this.tasks.has(id);
  }
}

module.exports = new TaskStore();