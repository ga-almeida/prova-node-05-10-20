import { Router, Request } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';
import CreateUserService from '../services/CreateUserService';
import DeleteUserService from '../services/DeleteUserService';
import UpdateUserService from '../services/UpdateUserService';
import ensureAutheticated from '../middlewares/ensureAutheticated';

const usersRouter = Router();

usersRouter.get('/', ensureAutheticated, async (request, response) => {
  const usersRepository = getRepository(User);
  const users = await usersRepository.find();

  return response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { name, email, username, password } = request.body;

  const createUserService = new CreateUserService();

  const user = await createUserService.execute({
    email,
    name,
    username,
    password,
  });

  return response.json(user);
});

usersRouter.put('/:id', async (request, response) => {
  const { name, email, username, password } = request.body;
  const { id } = request.params;

  const updateUserService = new UpdateUserService();

  const user = await updateUserService.execute({
    id,
    email,
    name,
    username,
    password,
  });

  return response.json(user);
});

usersRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteUserService = new DeleteUserService();
  await deleteUserService.execute(id);

  return response.status(204).send();
});

export default usersRouter;
