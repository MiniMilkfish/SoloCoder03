const schedule = require('node-schedule');
const taskStore = require('../models/taskStore');
const { TaskStatus } = require('../models/task');
const logger = require('../utils/logger');

class Scheduler {
  constructor() {
    this.jobs = new Map();
    this.executingTasks = new Set();
    this.missedExecutions = new Map();
  }

  async createTask(taskData) {
    const task = taskStore.add(taskData);
    
    try {
      this._scheduleJob(task);
      task.status = TaskStatus.RUNNING;
      logger.info(task.id, `Task created and scheduled: ${task.name}`, { cron: task.cron });
    } catch (error) {
      task.status = TaskStatus.PENDING;
      task.lastError = error.message;
      logger.error(task.id, `Failed to schedule task: ${task.name}`, { error: error.message });
      throw error;
    }
    
    return task.toJSON();
  }

  _scheduleJob(task) {
    const job = schedule.scheduleJob(task.id, task.cron, async () => {
      await this._executeTask(task);
    });
    
    this.jobs.set(task.id, job);
    
    if (job.nextInvocation()) {
      task.nextRunAt = job.nextInvocation().toISOString();
    }
  }

  async _executeTask(task) {
    const taskId = task.id;
    
    const missedCount = this.missedExecutions.get(taskId) || 0;
    if (missedCount > 0) {
      task.missedCount += missedCount;
      this.missedExecutions.set(taskId, 0);
    }
    
    if (task.preventOverlap && this.executingTasks.has(taskId)) {
      const newMissedCount = (this.missedExecutions.get(taskId) || 0) + 1;
      this.missedExecutions.set(taskId, newMissedCount);
      
      logger.warn(taskId, `Task execution skipped: ${task.name} - previous execution still running`, {
        missedCount: newMissedCount,
        currentTime: new Date().toISOString(),
        preventOverlap: task.preventOverlap
      });
      return;
    }
    
    this.executingTasks.add(taskId);
    const startTime = Date.now();
    
    logger.info(taskId, `Executing task: ${task.name}`, {
      preventOverlap: task.preventOverlap,
      executionCount: task.executionCount + 1
    });
    
    try {
      task.lastRunAt = new Date();
      task.executionCount++;
      
      const result = await task.callback(task.data, taskId);
      
      const duration = Date.now() - startTime;
      task.lastRunDuration = duration;
      
      const job = this.jobs.get(taskId);
      if (job && job.nextInvocation()) {
        task.nextRunAt = job.nextInvocation().toISOString();
      }
      
      logger.info(taskId, `Task executed successfully: ${task.name}`, {
        duration,
        result
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      task.lastRunDuration = duration;
      task.errorCount++;
      task.lastError = error.message;
      
      logger.error(taskId, `Task execution failed: ${task.name}`, {
        duration,
        error: error.message
      });
    } finally {
      this.executingTasks.delete(taskId);
    }
  }

  pauseTask(id) {
    const task = taskStore.get(id);
    if (!task) {
      throw new Error(`Task not found: ${id}`);
    }
    
    if (task.status === TaskStatus.PAUSED) {
      logger.warn(id, `Task is already paused: ${task.name}`);
      return task.toJSON();
    }
    
    const job = this.jobs.get(id);
    if (job) {
      job.cancel();
      this.jobs.delete(id);
    }
    
    task.status = TaskStatus.PAUSED;
    task.nextRunAt = null;
    
    logger.info(id, `Task paused: ${task.name}`);
    return task.toJSON();
  }

  resumeTask(id) {
    const task = taskStore.get(id);
    if (!task) {
      throw new Error(`Task not found: ${id}`);
    }
    
    if (task.status === TaskStatus.RUNNING) {
      logger.warn(id, `Task is already running: ${task.name}`);
      return task.toJSON();
    }
    
    if (task.status === TaskStatus.STOPPED) {
      throw new Error(`Cannot resume stopped task: ${id}. Use restart instead.`);
    }
    
    try {
      this._scheduleJob(task);
      task.status = TaskStatus.RUNNING;
      logger.info(id, `Task resumed: ${task.name}`);
    } catch (error) {
      task.lastError = error.message;
      logger.error(id, `Failed to resume task: ${task.name}`, { error: error.message });
      throw error;
    }
    
    return task.toJSON();
  }

  restartTask(id) {
    const task = taskStore.get(id);
    if (!task) {
      throw new Error(`Task not found: ${id}`);
    }
    
    const job = this.jobs.get(id);
    if (job) {
      job.cancel();
      this.jobs.delete(id);
    }
    
    try {
      this._scheduleJob(task);
      task.status = TaskStatus.RUNNING;
      task.lastError = null;
      logger.info(id, `Task restarted: ${task.name}`);
    } catch (error) {
      task.lastError = error.message;
      task.status = TaskStatus.PENDING;
      logger.error(id, `Failed to restart task: ${task.name}`, { error: error.message });
      throw error;
    }
    
    return task.toJSON();
  }

  deleteTask(id) {
    const task = taskStore.get(id);
    if (!task) {
      throw new Error(`Task not found: ${id}`);
    }
    
    const job = this.jobs.get(id);
    if (job) {
      job.cancel();
      this.jobs.delete(id);
    }
    
    this.executingTasks.delete(id);
    this.missedExecutions.delete(id);
    
    taskStore.delete(id);
    logger.info(id, `Task deleted: ${task.name}`);
    return true;
  }

  getTask(id) {
    const task = taskStore.get(id);
    if (!task) {
      return null;
    }
    
    const pendingMissed = this.missedExecutions.get(id) || 0;
    if (pendingMissed > 0) {
      task.missedCount += pendingMissed;
      this.missedExecutions.set(id, 0);
    }
    
    const job = this.jobs.get(id);
    if (job && job.nextInvocation()) {
      task.nextRunAt = job.nextInvocation().toISOString();
    }
    
    const taskData = task.toJSON();
    taskData.isExecuting = this.executingTasks.has(id);
    
    return taskData;
  }

  getAllTasks() {
    const tasks = taskStore.getAll();
    
    tasks.forEach(task => {
      const pendingMissed = this.missedExecutions.get(task.id) || 0;
      if (pendingMissed > 0) {
        task.missedCount += pendingMissed;
        this.missedExecutions.set(task.id, 0);
      }
      
      const job = this.jobs.get(task.id);
      if (job && job.nextInvocation()) {
        task.nextRunAt = job.nextInvocation().toISOString();
      }
      
      task.isExecuting = this.executingTasks.has(task.id);
    });
    
    return tasks;
  }

  shutdown() {
    logger.info(null, 'Scheduler shutting down...');
    
    this.jobs.forEach((job, id) => {
      job.cancel();
      const task = taskStore.get(id);
      if (task) {
        task.status = TaskStatus.STOPPED;
        task.nextRunAt = null;
      }
    });
    
    this.jobs.clear();
    logger.info(null, 'Scheduler shut down successfully');
  }
}

module.exports = new Scheduler();