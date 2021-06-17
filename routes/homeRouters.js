/* eslint-disable import/extensions */
import express from 'express';
import {
  register,
  login,
  postLogin,
  postRegister,
  postLogOut,
  userProfile,
  initHomeController,
} from '../controllers/homeController.js';

const HomeController = initHomeController();

const router = express.Router();
router.get('/', HomeController.index);
router.get('/register', register);
router.post('/register', postRegister);
router.get('/profile/:uid', userProfile);
router.get('/log-in', login);
router.post('/log-in', postLogin);
router.get('/log-out', postLogOut);
// router.get('/jobs/:page', viewJobs);

export default router;
