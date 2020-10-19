const router = require('express').Router();
const tasksService = require('./tasks.service');
const handler = require('../../utils/handler');
const createSuccessObj = require('../../utils/success');

router.route('/:boardId/tasks').get(
  handler(async (req, res, next) => {
    const { boardId } = req.params;
    const tasks = await tasksService.getTasksByBoardId(boardId);
    res.json(tasks.map(task => task.toResponse()));
    next(
      createSuccessObj({
        statusCode: 200,
        url: '/:boardId/tasks',
        type: 'get',
        queryParams: req.params,
        body: req.body,
        result: tasks.map(task => task.toResponse())
      })
    );
  })
);

router.route('/:boardId/tasks').post(
  handler(async (req, res, next) => {
    const { boardId } = req.params;
    const {
      title,
      order,
      description,
      userId,
      boardId: boardIdInBody,
      columnId
    } = req.body;
    const task = await tasksService.addTask({
      title,
      order,
      description,
      userId,
      boardId: boardIdInBody || boardId,
      columnId
    });
    res.json(task.toResponse());
    next(
      createSuccessObj({
        statusCode: 200,
        type: 'post',
        url: '/:boardId/tasks',
        queryParams: req.params,
        body: req.body,
        result: task.toResponse()
      })
    );
  })
);

router.route('/:boardId/tasks/:taskId').get(
  handler(async (req, res, next) => {
    const { boardId, taskId } = req.params;
    const task = await tasksService.findTask(taskId, boardId);
    res.json(task.toResponse());
    next(
      createSuccessObj({
        statusCode: 200,
        type: 'get',
        url: '/:boardId/tasks/:taskId',
        queryParams: req.params,
        body: req.body,
        result: task.toResponse()
      })
    );
  })
);

router.route('/:boardId/tasks/:taskId').put(
  handler(async (req, res, next) => {
    const { boardId, taskId } = req.params;
    const task = await tasksService.findTask(taskId, boardId);
    const {
      title,
      order,
      description,
      userId,
      boardId: boardIdInBody,
      columnId
    } = req.body;
    const updatedTask = await tasksService.updateById({
      title,
      order,
      description,
      userId,
      boardId: boardIdInBody || boardId,
      columnId,
      task
    });
    res.json(updatedTask.toResponse());
    next(
      createSuccessObj({
        statusCode: 200,
        type: 'put',
        url: '/:boardId/tasks/:taskId',
        queryParams: req.params,
        body: req.body,
        result: updatedTask.toResponse()
      })
    );
  })
);

router.route('/:boardId/tasks/:taskId').delete(
  handler(async (req, res, next) => {
    const { boardId, taskId } = req.params;
    await tasksService.findTask(taskId, boardId);
    await tasksService.deleteTask(taskId, boardId);
    res.status(204).end();
    next(
      createSuccessObj({
        statusCode: 204,
        type: 'delete',
        url: '/:boardId/tasks/:taskId',
        queryParams: req.params,
        body: req.body
      })
    );
  })
);

module.exports = router;
