import { getRepository } from 'typeorm';

import User from '../models/User';
import AppError from '../errors/AppError';

class CreateUserService {
  public async execute(id: string): Promise<void> {
    const usersRepository = getRepository(User);

    const checkUserExiste = await usersRepository.findOne(id);

    if (!checkUserExiste) {
      throw new AppError('User does not exist', 400);
    }

    await usersRepository.remove(checkUserExiste);
  }
}

export default CreateUserService;
