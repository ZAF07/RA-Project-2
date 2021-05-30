import express from 'express';
import {
  viewJobs,
  postInterestForJob,
} from '../controllers/jobsControllers.js';

const router = express.Router();

router.get('/:page', viewJobs);
router.post('/', postInterestForJob);

export default router;
