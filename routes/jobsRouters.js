import express from 'express';
import {
  viewJobs,
  postInterestForJob,
  postCreateJobForm,
  createJob,
  jobDetails,
  deleteOneJob,
} from '../controllers/jobsControllers.js';

const router = express.Router();

router.get('/', viewJobs);

router.post('/', postInterestForJob);
router.get('/details/:id', jobDetails);
router.get('/create-job', postCreateJobForm)
router.post('/create-job-form', postCreateJobForm);
router.post('/create-job', createJob)
router.post('/delete', deleteOneJob)

export default router;
