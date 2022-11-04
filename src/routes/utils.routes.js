import { Router } from 'express';
import authMiddleware from '../middlewares/authentication.js';
import adminMiddleware from '../middlewares/administrator.js';

function pong(req, res) {
  res.status(200).json({
    message: 'pong'
  });
}

const router = Router();

router.get('/ping', pong);

router.get('/private/ping', authMiddleware, pong);

router.get('/admin/ping', authMiddleware, adminMiddleware, pong);

export default router;