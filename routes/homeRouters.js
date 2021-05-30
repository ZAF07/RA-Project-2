import express from 'express';
import {
  home,
  register,
  login,
  postLogin,
  postRegister,
} from '../controllers/homeController.js';

const router = express.Router();
router.get('/', home);
router.get('/register', register);
router.post('/register', postRegister);
router.get('/log-in', login);
router.post('/log-in', postLogin)
// router.get('/jobs/:page', viewJobs);

export default router;
