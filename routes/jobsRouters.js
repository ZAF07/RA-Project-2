import express from 'express';
import { viewJobs } from '../controllers/jobsControllers.js';

const router = express.Router();

router.get('/:page', viewJobs);
router.post('/', (req, res) => {
  if (!req.cookie) {
    res.send('Not logged in');
    
  }
  res.json('req.body');
})

export default router;
