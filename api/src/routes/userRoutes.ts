import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AppDataSource } from '../data-source';

const router = Router();
const userController = new UserController(AppDataSource);

router.post('/user', userController.newUser.bind(userController));
router.post('/user/login', userController.login.bind(userController));

export default router;