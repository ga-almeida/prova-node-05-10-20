import express, { Request, Response, NextFunction } from 'express';

import 'reflect-metadata';
import 'express-async-errors';
import './database';

import AppError from './errors/AppError';

import routes from './routes';

const app = express();
app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  return response
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

app.listen(3334, () => {
  console.log('Server started on port 3334!');
});
