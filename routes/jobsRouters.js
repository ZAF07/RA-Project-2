import express from 'express';
import {
  viewJobs,
  postInterestForJob,
  postCreateJobForm,
  createJob,
} from '../controllers/jobsControllers.js';

const router = express.Router();

router.get('/', viewJobs);

router.post('/', postInterestForJob);
router.get('/create-job', postCreateJobForm)
router.post('/create-job-form', postCreateJobForm);
router.post('/create-job', createJob)

export default router;
