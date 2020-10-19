const boom = require('boom');
const boardsRepo = require('./board.memory.repository');
const Board = require('./boards.model');
const Column = require('./columns.model');
const { newBoard } = require('./boards.schema');

const getAll = () => boardsRepo.getAll();

const createBoard = (title, columns) => {
  const { error } = newBoard.validate({ title, columns });
  if (error) throw boom.badRequest(error.message, { request: 'createBoard' });
  const columnsInBoard = columns.map(
    ({ title: titleColumn, order }) => new Column({ title: titleColumn, order })
  );
  const board = new Board({ title, columns: columnsInBoard });
  return boardsRepo.addBoard(board);
};

const getById = async id => {
  const board = await boardsRepo.getById(id);
  if (!board) {
    throw boom.notFound("This board doesn't exist", {
      request: 'getByIdBoard'
    });
  }
  return board;
};

const deleteBoardById = id => {
  return boardsRepo.deleteBoardById(id);
};

const updateBoard = (board, title, columns) => {
  const { error } = newBoard.validate({ title, columns });
  if (error) throw boom.badRequest(error.message, { request: 'updateBoard' });
  const newColumns = columns.map(({ title: titleColumn, order, id }) => {
    return new Column({ id, order, title: titleColumn });
  });
  board.update(title, newColumns);
  return board;
};

module.exports = { getAll, createBoard, getById, updateBoard, deleteBoardById };
