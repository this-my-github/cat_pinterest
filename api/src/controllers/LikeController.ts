import { Request, Response } from 'express';
import { Like } from '../models/Like';
import { DataSource, Repository } from 'typeorm';

export class LikeController {
  private likeRepository: Repository<Like>;

  constructor(private dataSource: DataSource) {
    this.likeRepository = this.dataSource.getRepository(Like);
  }

  async listLikes(req: Request, res: Response) {
      try {
        const likes = await this.likeRepository.find();
        return res.json(likes);
      } catch (error) {
        console.error('Ошибка при получении котиков:', error);
        return res.status(500).json({ message: 'Ошибка при получении котиков' });
      }
  }

  async newLike(req: Request, res: Response) {
    const { cat_id } = req.body;

    const existingLike = await this.likeRepository.findOne({ where: { cat_id } });
    
    if (existingLike) {
        return res.status(400).json({ message: 'Этот кот уже в избранном' });
    }

    const like = this.likeRepository.create({ cat_id, created_at: new Date() });
    await this.likeRepository.save(like);

    return res.status(201).json(like);
  }

  async dropLike(req: Request, res: Response) {
    const { cat_id } = req.params;

    const like = await this.likeRepository.findOne({ where: { cat_id } });
    if (!like) {
      return res.status(404).json({ message: 'Like not found' });
    }
    await this.likeRepository.remove(like);
    return res.status(200).json({ message: `Ok ${cat_id}` });
  }
}