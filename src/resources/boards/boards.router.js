const router = require('express').Router();
const boardsService = require('./boards.service');
const handler = require('../../utils/handler');
const createSuccessObj = require('../../utils/success');

router.use('/', require('../tasks/tasks.router'));

router.route('/').get(
  handler(async (req, res, next) => {
    const boards = await boardsService.getAll();
    res.json(boards.map(board => board.toResponse()));
    next(
      createSuccessObj({
        statusCode: 200,
        url: '/boards/',
        type: 'get',
        queryParams: req.params,
        body: req.body,
        result: boards.map(board => board.toResponse())
      })
    );
  })
);

router.route('/').post(
  handler(async (req, res, next) => {
    const { title, columns } = req.body;
    const board = await boardsService.createBoard(title, columns);
    res.json(board.toResponse());
    next(
      createSuccessObj({
        statusCode: 200,
        url: '/boards/',
        type: 'post',
        queryParams: req.params,
        body: req.body,
        result: board.toResponse()
      })
    );
  })
);

router.route('/:id').get(
  handler(async (req, res, next) => {
    const { id } = req.params;
    const board = await boardsService.getById(id);
    res.json(board.toResponse());
    next(
      createSuccessObj({
        statusCode: 200,
        url: '/boards/:id',
        type: 'get',
        queryParams: req.params,
        body: req.body,
        result: board.toResponse()
      })
    );
  })
);

router.route('/:id').put(
  handler(async (req, res, next) => {
    const { id } = req.params;
    const board = await boardsService.getById(id);
    const { title, columns } = req.body;
    await boardsService.updateBoard(board, title, columns);
    res.json(board.toResponse());
    next(
      createSuccessObj({
        statusCode: 200,
        url: '/boards/:id',
        type: 'put',
        queryParams: req.params,
        body: req.body,
        result: board.toResponse()
      })
    );
  })
);

router.route('/:id').delete(
  handler(async (req, res, next) => {
    const { id } = req.params;
    await boardsService.getById(id);
    await boardsService.deleteBoardById(id);
    res.status(204).end();
    next(
      createSuccessObj({
        statusCode: 200,
        url: '/boards/:id',
        type: 'delete',
        queryParams: req.params,
        body: req.body
      })
    );
  })
);

module.exports = router;
