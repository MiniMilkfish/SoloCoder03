const Router = require('koa-router');
const taskController = require('../controllers/taskController');

const router = new Router({
  prefix: '/api/tasks'
});

router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/:id/pause', taskController.pauseTask);
router.post('/:id/resume', taskController.resumeTask);
router.post('/:id/restart', taskController.restartTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;