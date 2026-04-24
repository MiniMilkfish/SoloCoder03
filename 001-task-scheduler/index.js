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

process.on('SIGINT', () => {
  logger.info(null, 'Received SIGINT, shutting down gracefully...');
  
  scheduler.shutdown();
  
  server.close(() => {
    logger.info(null, 'Server closed');
    process.exit(0);
  });
  
  setTimeout(() => {
    logger.error(null, 'Forcing shutdown');
    process.exit(1);
  }, 5000);
});

process.on('SIGTERM', () => {
  logger.info(null, 'Received SIGTERM, shutting down gracefully...');
  
  scheduler.shutdown();
  
  server.close(() => {
    logger.info(null, 'Server closed');
    process.exit(0);
  });
});

module.exports = app;