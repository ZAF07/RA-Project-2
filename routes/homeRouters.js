import express from 'express';
import { home, register, login } from '../controllers/homeController.js';

const router = express.Router();
router.get('/', home);
router.get('/register', register);
router.get('/log-in', login);
// router.get('/jobs/:page', viewJobs);

export default router;
