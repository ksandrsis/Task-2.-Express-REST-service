let { tasks } = require('../store');

const getTasksByBoardId = async boardId =>
  tasks.filter(task => task.boardId === boardId);

const addTask = async task => {
  await tasks.push(task);
  return task;
};

const deleteTask = async (taskId, boardId) => {
  tasks = tasks.filter(task => task.id !== taskId || task.boardId !== boardId);
  return tasks;
};
const findTask = async (taskId, boardId) => {
  return tasks.find(t => t.id === taskId && t.boardId === boardId);
};

module.exports = { getTasksByBoardId, deleteTask, addTask, findTask };
