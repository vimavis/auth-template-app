import { Router } from 'express';
const router = Router();

import { registerRequest, loginRequest } from '../controllers/auth.controller.js';

router.post('/register', registerRequest);
router.post('/login', loginRequest);

export default router;