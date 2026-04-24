const crypto = require('crypto');

const TaskStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  PAUSED: 'paused',
  STOPPED: 'stopped'
};

class Task {
  constructor({ name, cron, callback, data = null }) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.cron = cron;
    this.callback = callback;
    this.data = data;
    this.status = TaskStatus.PENDING;
    this.createdAt = new Date();
    this.lastRunAt = null;
    this.nextRunAt = null;
    this.executionCount = 0;
    this.errorCount = 0;
    this.lastError = null;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      cron: this.cron,
      data: this.data,
      status: this.status,
      createdAt: this.createdAt,
      lastRunAt: this.lastRunAt,
      nextRunAt: this.nextRunAt,
      executionCount: this.executionCount,
      errorCount: this.errorCount,
      lastError: this.lastError
    };
  }
}

module.exports = {
  Task,
  TaskStatus
};