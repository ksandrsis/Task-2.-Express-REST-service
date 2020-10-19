const boom = require('boom');
const tasksRepo = require('./tasks.memory.repository');
const Task = require('./tasks.model');
const task = require('./tasks.schema');

const getTasksByBoardId = boardId => tasksRepo.getTasksByBoardId(boardId);

const addTask = ({ title, order, description, userId, boardId, columnId }) => {
  const { error } = task.validate({
    title,
    order,
    description,
    userId,
    boardId,
    columnId
  });
  if (error) {
    throw boom.badRequest(error.message, {
      request: 'addTask'
    });
  }
  const newTask = new Task({
    title,
    order,
    description,
    userId,
    boardId,
    columnId
  });
  return tasksRepo.addTask(newTask);
};

const updateById = ({
  title,
  order,
  description,
  userId,
  boardId,
  columnId,
  task: existedTask
}) => {
  const { error } = task.validate({
    title,
    order,
    description,
    userId,
    boardId,
    columnId
  });
  if (error) {
    throw boom.badRequest(error.message, {
      request: 'updateByIdTask'
    });
  }
  existedTask.update({ title, order, description, userId, boardId, columnId });
  return existedTask;
};

const deleteTask = (taskId, boardId) => tasksRepo.deleteTask(taskId, boardId);
const findTask = async (taskId, boardId) => {
  const existedTask = await tasksRepo.findTask(taskId, boardId);
  if (!existedTask) {
    throw boom.notFound("This task doesn't exist", { request: 'findTask' });
  }
  return existedTask;
};

module.exports = {
  getTasksByBoardId,
  addTask,
  updateById,
  deleteTask,
  findTask
};
