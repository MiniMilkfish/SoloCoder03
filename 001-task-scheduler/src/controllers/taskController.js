const scheduler = require('../services/scheduler');
const logger = require('../utils/logger');

class TaskController {
  async createTask(ctx) {
    const { name, cron, callback, data, preventOverlap } = ctx.request.body;
    
    if (!name || !cron || !callback) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing required fields: name, cron, callback'
      };
      return;
    }
    
    try {
      const fn = new Function('data', 'taskId', callback);
      
      const taskOptions = {
        name,
        cron,
        callback: fn,
        data
      };
      
      if (typeof preventOverlap === 'boolean') {
        taskOptions.preventOverlap = preventOverlap;
      }
      
      const task = await scheduler.createTask(taskOptions);
      
      ctx.status = 201;
      ctx.body = {
        success: true,
        data: task
      };
    } catch (error) {
      logger.error(null, 'Failed to create task', { error: error.message });
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: `Failed to create task: ${error.message}`
      };
    }
  }

  async getAllTasks(ctx) {
    try {
      const tasks = scheduler.getAllTasks();
      
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: tasks
      };
    } catch (error) {
      logger.error(null, 'Failed to get all tasks', { error: error.message });
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: `Failed to get tasks: ${error.message}`
      };
    }
  }

  async getTaskById(ctx) {
    const { id } = ctx.params;
    
    try {
      const task = scheduler.getTask(id);
      
      if (!task) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: `Task not found: ${id}`
        };
        return;
      }
      
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: task
      };
    } catch (error) {
      logger.error(null, 'Failed to get task', { error: error.message });
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: `Failed to get task: ${error.message}`
      };
    }
  }

  async pauseTask(ctx) {
    const { id } = ctx.params;
    
    try {
      const task = scheduler.pauseTask(id);
      
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: task
      };
    } catch (error) {
      if (error.message.includes('Task not found')) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: error.message
        };
      } else {
        logger.error(null, 'Failed to pause task', { error: error.message });
        ctx.status = 500;
        ctx.body = {
          success: false,
          message: `Failed to pause task: ${error.message}`
        };
      }
    }
  }

  async resumeTask(ctx) {
    const { id } = ctx.params;
    
    try {
      const task = scheduler.resumeTask(id);
      
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: task
      };
    } catch (error) {
      if (error.message.includes('Task not found')) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: error.message
        };
      } else if (error.message.includes('Cannot resume')) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: error.message
        };
      } else {
        logger.error(null, 'Failed to resume task', { error: error.message });
        ctx.status = 500;
        ctx.body = {
          success: false,
          message: `Failed to resume task: ${error.message}`
        };
      }
    }
  }

  async restartTask(ctx) {
    const { id } = ctx.params;
    
    try {
      const task = scheduler.restartTask(id);
      
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: task
      };
    } catch (error) {
      if (error.message.includes('Task not found')) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: error.message
        };
      } else {
        logger.error(null, 'Failed to restart task', { error: error.message });
        ctx.status = 500;
        ctx.body = {
          success: false,
          message: `Failed to restart task: ${error.message}`
        };
      }
    }
  }

  async deleteTask(ctx) {
    const { id } = ctx.params;
    
    try {
      const success = scheduler.deleteTask(id);
      
      ctx.status = 200;
      ctx.body = {
        success: true,
        message: `Task ${id} deleted successfully`
      };
    } catch (error) {
      if (error.message.includes('Task not found')) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: error.message
        };
      } else {
        logger.error(null, 'Failed to delete task', { error: error.message });
        ctx.status = 500;
        ctx.body = {
          success: false,
          message: `Failed to delete task: ${error.message}`
        };
      }
    }
  }
}

module.exports = new TaskController();