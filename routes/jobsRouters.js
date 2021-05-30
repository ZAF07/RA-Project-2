import express from 'express';
import {
  viewJobs,
  postInterestForJob,
  postCreateJob,
  createJob,
} from '../controllers/jobsControllers.js';

const router = express.Router();

router.get('/:page', viewJobs);

router.post('/', postInterestForJob);
router.post('/create-job-form', postCreateJob);
router.post('/create-job', createJob)

export default router;
