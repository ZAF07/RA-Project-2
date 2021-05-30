import express from 'express';
import { home, register, viewJobs } from '../controllers/homeController.js';

const router = express.Router();
router.get('/', home);
router.get('/register', register);
router.get('/jobs/:page', viewJobs);

export default router;
