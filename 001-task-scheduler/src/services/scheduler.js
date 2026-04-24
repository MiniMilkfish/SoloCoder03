const schedule = require('node-schedule');
const taskStore = require('../models/taskStore');
const { TaskStatus } = require('../models/task');
const logger = require('../utils/logger');

class Scheduler {
  constructor() {
    this.jobs = new Map();
    this.executingTasks = new Set();
    this.executionPromises = new Map();
    this.missedExecutions = new Map();
    this.isShuttingDown = false;
    this.defaultShutdownTimeout = 30000;
  }

  async createTask(taskData) {
    if (this.isShuttingDown) {
      throw new Error('Scheduler is shutting down, cannot create new tasks');
    }
    
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
      if (this.isShuttingDown) {
        logger.warn(task.id, `Task execution skipped: ${task.name} - scheduler is shutting down`);
        return;
      }
      await this._executeTask(task);
    });
    
    this.jobs.set(task.id, job);
    
    if (job.nextInvocation()) {
      task.nextRunAt = job.nextInvocation().toISOString();
    }
  }

  async _executeTask(task) {
    const taskId = task.id;
    
    if (this.isShuttingDown) {
      logger.warn(taskId, `Task execution skipped: ${task.name} - scheduler is shutting down`);
      return;
    }
    
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
    
    const executionPromise = (async () => {
      logger.info(taskId, `Executing task: ${task.name}`, {
        preventOverlap: task.preventOverlap,
        executionCount: task.executionCount + 1,
        isShuttingDown: this.isShuttingDown
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
        
        return { success: true, result, duration };
      } catch (error) {
        const duration = Date.now() - startTime;
        task.lastRunDuration = duration;
        task.errorCount++;
        task.lastError = error.message;
        
        logger.error(taskId, `Task execution failed: ${task.name}`, {
          duration,
          error: error.message
        });
        
        return { success: false, error: error.message, duration };
      } finally {
        this.executingTasks.delete(taskId);
        this.executionPromises.delete(taskId);
      }
    })();
    
    this.executionPromises.set(taskId, executionPromise);
    
    return executionPromise;
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

  async shutdown(timeout = null) {
    const shutdownTimeout = timeout || this.defaultShutdownTimeout;
    const startTime = Date.now();
    
    if (this.isShuttingDown) {
      logger.warn(null, 'Scheduler is already shutting down...');
      return { alreadyShuttingDown: true };
    }
    
    this.isShuttingDown = true;
    logger.info(null, 'Scheduler shutting down gracefully...', {
      timeout: shutdownTimeout,
      executingTasksCount: this.executingTasks.size
    });
    
    this.jobs.forEach((job, id) => {
      job.cancel();
      const task = taskStore.get(id);
      if (task) {
        task.status = TaskStatus.STOPPED;
        task.nextRunAt = null;
      }
    });
    
    this.jobs.clear();
    
    const executingTaskIds = Array.from(this.executingTasks);
    
    if (executingTaskIds.length === 0) {
      logger.info(null, 'No tasks executing, scheduler shut down immediately');
      return {
        success: true,
        waited: false,
        tasksCompleted: [],
        tasksForcefullyTerminated: []
      };
    }
    
    logger.info(null, `Waiting for ${executingTaskIds.length} task(s) to complete...`, {
      taskIds: executingTaskIds,
      timeout: shutdownTimeout
    });
    
    executingTaskIds.forEach(id => {
      const task = taskStore.get(id);
      if (task) {
        logger.warn(id, `Task is still executing during shutdown: ${task.name}`, {
          executionCount: task.executionCount,
          lastRunAt: task.lastRunAt
        });
      }
    });
    
    const results = {
      success: true,
      waited: true,
      tasksCompleted: [],
      tasksForcefullyTerminated: [],
      timedOut: false
    };
    
    let timeoutTimer = null;
    
    const waitPromise = (async () => {
      const promises = [];
      
      executingTaskIds.forEach(id => {
        const promise = this.executionPromises.get(id);
        if (promise) {
          promises.push(
            promise
              .then(result => {
                results.tasksCompleted.push({
                  taskId: id,
                  result
                });
                return { taskId: id, success: true };
              })
              .catch(error => {
                results.tasksCompleted.push({
                  taskId: id,
                  error: error.message
                });
                return { taskId: id, success: false, error: error.message };
              })
          );
        } else {
          this.executingTasks.delete(id);
        }
      });
      
      await Promise.all(promises);
    })();
    
    const timeoutPromise = new Promise((resolve) => {
      timeoutTimer = setTimeout(() => {
        results.timedOut = true;
        results.success = false;
        
        const stillExecuting = Array.from(this.executingTasks);
        
        stillExecuting.forEach(id => {
          const task = taskStore.get(id);
          results.tasksForcefullyTerminated.push({
            taskId: id,
            taskName: task ? task.name : 'unknown'
          });
          
          logger.error(id, `Task execution timed out during shutdown: ${task ? task.name : id}`, {
            waited: Date.now() - startTime,
            timeout: shutdownTimeout
          });
        });
        
        this.executingTasks.clear();
        this.executionPromises.clear();
        
        logger.error(null, 'Shutdown timed out, forcefully terminating remaining tasks', {
          timedOutTasks: stillExecuting.length,
          waited: Date.now() - startTime
        });
        
        resolve();
      }, shutdownTimeout);
    });
    
    try {
      await Promise.race([waitPromise, timeoutPromise]);
    } finally {
      if (timeoutTimer) {
        clearTimeout(timeoutTimer);
      }
    }
    
    const totalTime = Date.now() - startTime;
    
    if (results.timedOut) {
      logger.warn(null, 'Scheduler shut down with timeout', {
        totalTime,
        completedTasks: results.tasksCompleted.length,
        forcefullyTerminated: results.tasksForcefullyTerminated.length
      });
    } else {
      logger.info(null, 'Scheduler shut down successfully', {
        totalTime,
        completedTasks: results.tasksCompleted.length
      });
    }
    
    return results;
  }

  async forceShutdown() {
    logger.warn(null, 'Force shutdown initiated - terminating all tasks immediately');
    
    this.isShuttingDown = true;
    
    this.jobs.forEach((job, id) => {
      job.cancel();
      const task = taskStore.get(id);
      if (task) {
        task.status = TaskStatus.STOPPED;
        task.nextRunAt = null;
      }
    });
    
    this.jobs.clear();
    
    const stillExecuting = Array.from(this.executingTasks);
    
    stillExecuting.forEach(id => {
      const task = taskStore.get(id);
      logger.error(id, `Task forcefully terminated during shutdown: ${task ? task.name : id}`);
    });
    
    this.executingTasks.clear();
    this.executionPromises.clear();
    this.missedExecutions.clear();
    
    logger.warn(null, 'Force shutdown complete', {
      forcefullyTerminatedTasks: stillExecuting.length
    });
    
    return {
      success: true,
      forcefullyTerminated: stillExecuting.length,
      forceShutdown: true
    };
  }

  isShuttingDownStatus() {
    return this.isShuttingDown;
  }

  getExecutingTasks() {
    return {
      count: this.executingTasks.size,
      taskIds: Array.from(this.executingTasks)
    };
  }
}

module.exports = new Scheduler();