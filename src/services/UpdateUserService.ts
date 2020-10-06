import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
}

class UpdateUserService {
  public async execute({
    id,
    name,
    email,
    username,
    password,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExiste = await usersRepository.findOne(id);
    if (!checkUserExiste) {
      throw new AppError('User does not exist!', 400);
    }

    if (name) {
      checkUserExiste.name = name;
    }

    if (password) {
      const hashedPassword = await hash(password, 8);
      checkUserExiste.password = hashedPassword;
    }

    if (email) {
      const checkUserEmailExiste = await usersRepository.findOne({
        where: { email },
      });

      if (checkUserEmailExiste) {
        throw new AppError('Email addres already used!', 400);
      }

      checkUserExiste.email = email;
    }

    if (username) {
      const checkUserUsernameExiste = await usersRepository.findOne({
        where: { username },
      });

      if (checkUserUsernameExiste) {
        throw new AppError('Username addres already used!', 400);
      }

      checkUserExiste.username = username;
    }

    await usersRepository.save(checkUserExiste);

    return checkUserExiste;
  }
}

export default UpdateUserService;
