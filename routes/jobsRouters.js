import express from 'express';
import { viewJobs } from '../controllers/jobsControllers.js';

const router = express.Router();

router.get('/:page', viewJobs);

export default router;
