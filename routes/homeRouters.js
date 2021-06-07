import express from 'express';
import {
  home,
  register,
  login,
  postLogin,
  postRegister,
  postLogOut,
  userProfile,
} from '../controllers/homeController.js';

const router = express.Router();
router.get('/', home);
router.get('/register', register);
router.get('/profile/:uid', userProfile)
router.post('/register', postRegister);
router.get('/log-in', login);
router.post('/log-in', postLogin)
router.get('/log-out', postLogOut);
// router.get('/jobs/:page', viewJobs);

export default router;
