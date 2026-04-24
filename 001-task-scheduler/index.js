const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const config = require('./config');
const tasksRouter = require('./src/routes/tasks');
const logger = require('./src/utils/logger');
const scheduler = require('./src/services/scheduler');

const app = new Koa();

app.use(bodyParser());

app.use(async (ctx, next) => {
  const start = Date.now();
  logger.info(null, `[REQUEST] ${ctx.method} ${ctx.url}`);
  
  await next();
  
  const ms = Date.now() - start;
  logger.info(null, `[RESPONSE] ${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms`);
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    logger.error(null, 'Unhandled error', { error: error.message, stack: error.stack });
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Internal Server Error'
    };
  }
});

app.use(tasksRouter.routes());
app.use(tasksRouter.allowedMethods());

app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = {
    success: false,
    message: 'Route not found'
  };
});

const server = app.listen(config.port, () => {
  logger.info(null, `Task Scheduler Service is running on http://localhost:${config.port}`);
  logger.info(null, 'Available API endpoints:');
  logger.info(null, '  POST   /api/tasks          - Create a new task');
  logger.info(null, '  GET    /api/tasks          - Get all tasks');
  logger.info(null, '  GET    /api/tasks/:id      - Get task by id');
  logger.info(null, '  POST   /api/tasks/:id/pause  - Pause a task');
  logger.info(null, '  POST   /api/tasks/:id/resume - Resume a task');
  logger.info(null, '  POST   /api/tasks/:id/restart - Restart a task');
  logger.info(null, '  DELETE /api/tasks/:id      - Delete a task');
});

const SHUTDOWN_TIMEOUT = config.shutdown?.timeout || 30000;
const FORCE_TIMEOUT = config.shutdown?.forceTimeout || 35000;

async function gracefulShutdown(signal) {
  logger.info(null, `Received ${signal}, initiating graceful shutdown...`, {
    shutdownTimeout: SHUTDOWN_TIMEOUT
  });
  
  try {
    server.close(async () => {
      logger.info(null, 'HTTP server closed, shutting down scheduler...');
      
      const shutdownResult = await scheduler.shutdown(SHUTDOWN_TIMEOUT);
      
      if (shutdownResult.timedOut) {
        logger.error(null, 'Shutdown completed with timeout - some tasks were forcefully terminated', {
          completedTasks: shutdownResult.tasksCompleted.length,
          forcefullyTerminated: shutdownResult.tasksForcefullyTerminated.length
        });
        
        shutdownResult.tasksForcefullyTerminated.forEach(task => {
          logger.error(null, `Task forcefully terminated: ${task.taskName} (${task.taskId})`);
        });
        
        process.exit(1);
      } else {
        logger.info(null, 'Graceful shutdown completed successfully', {
          completedTasks: shutdownResult.tasksCompleted.length,
          waited: shutdownResult.waited
        });
        
        process.exit(0);
      }
    });
    
    setTimeout(() => {
      logger.error(null, `Server close timed out after ${FORCE_TIMEOUT}ms, forcing exit`);
      scheduler.forceShutdown();
      process.exit(1);
    }, FORCE_TIMEOUT);
    
  } catch (error) {
    logger.error(null, 'Error during graceful shutdown', { error: error.message, stack: error.stack });
    try {
      scheduler.forceShutdown();
    } catch (e) {
      logger.error(null, 'Force shutdown also failed', { error: e.message });
    }
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  gracefulShutdown('SIGINT');
});

process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM');
});

process.on('uncaughtException', (error) => {
  logger.error(null, 'Uncaught exception', {
    error: error.message,
    stack: error.stack
  });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(null, 'Unhandled promise rejection', {
    reason: reason ? reason.message || String(reason) : 'unknown'
  });
});

module.exports = app;