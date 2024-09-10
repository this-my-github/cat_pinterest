import { hash, compare } from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { DataSource, Repository } from 'typeorm';
import { generate } from '../utils/token';

export class UserController {
  private userRepository: Repository<User>;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async newUser(req: Request, res: Response) {
    const { login, password } = req.body;

    if (!login) {
      return res.status(400).json({ message: 'Login is required' });
    }

    try {
      const hashedPassword = await hash(password, 10);
      const user = this.userRepository.create({ login, password: hashedPassword });
      await this.userRepository.save(user);

      const token = generate({ userId: user.id });

      return res.status(201).json({ user, token });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Error creating user' });
    }
  }

  async login(req: Request, res: Response) {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ message: 'Login and password are required' });
    }

    try {
      const user = await this.userRepository.findOneBy({ login });

      if (!user) {
        return res.status(401).json({ message: 'Invalid login or password' });
      }

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid login or password' });
      }

      const token = generate({ userId: user.id });

      return res.status(200).json({ user, token });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Error logging in' });
    }
  }
}