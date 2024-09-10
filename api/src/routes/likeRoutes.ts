import { Router } from 'express';
import { LikeController } from '../controllers/LikeController';
import { AppDataSource } from '../data-source';

const router = Router();
const likeController = new LikeController(AppDataSource);

router.get('/likes', likeController.listLikes.bind(likeController));
router.post('/likes', likeController.newLike.bind(likeController));
router.delete('/likes/:cat_id', likeController.dropLike.bind(likeController));

export default router;