import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  username: string;
  password: string;
}

class CreateUserService {
  public async execute({
    name,
    email,
    username,
    password,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExiste = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExiste) {
      throw new AppError('Email addres already used!', 400);
    }

    const checkUsernameExiste = await usersRepository.findOne({
      where: { username },
    });

    if (checkUsernameExiste) {
      throw new AppError('Username addres already used!', 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
