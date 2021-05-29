import express from 'express';
import { home, register } from '../controllers/homeController.js';

const router = express.Router();
router.get('/', home);
router.get('/register', register);

export default router;
