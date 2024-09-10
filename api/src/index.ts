require("dotenv").config();

import * as express from 'express';
import likeRoutes from './routes/likeRoutes';
import userRoutes from './routes/userRoutes';
import { authMiddleware } from './middlewares/authMiddleware';
import * as cors from 'cors';
import { AppDataSource } from "./data-source"

AppDataSource.initialize().then(async () => {    
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use('/api', userRoutes);
    app.use('/api', authMiddleware, likeRoutes);

    app.listen(3001, () => {
        console.log('Server is running on port 3001');
      });

}).catch(error => console.log(error))
