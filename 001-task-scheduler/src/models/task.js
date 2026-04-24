const crypto = require('crypto');

const TaskStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  PAUSED: 'paused',
  STOPPED: 'stopped'
};

class Task {
  constructor({ name, cron, callback, data = null, preventOverlap = true }) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.cron = cron;
    this.callback = callback;
    this.data = data;
    this.preventOverlap = preventOverlap;
    this.status = TaskStatus.PENDING;
    this.createdAt = new Date();
    this.lastRunAt = null;
    this.nextRunAt = null;
    this.executionCount = 0;
    this.missedCount = 0;
    this.errorCount = 0;
    this.lastError = null;
    this.lastRunDuration = null;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      cron: this.cron,
      data: this.data,
      preventOverlap: this.preventOverlap,
      status: this.status,
      createdAt: this.createdAt,
      lastRunAt: this.lastRunAt,
      nextRunAt: this.nextRunAt,
      executionCount: this.executionCount,
      missedCount: this.missedCount,
      errorCount: this.errorCount,
      lastError: this.lastError,
      lastRunDuration: this.lastRunDuration
    };
  }
}

module.exports = {
  Task,
  TaskStatus
};