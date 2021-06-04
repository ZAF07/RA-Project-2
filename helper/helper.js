import pool from '../model/db.js';

const getEmployerEmail = async (jobId) => {

  try {
    // Get employer_id from jobs
    const { rows: employerId } = await pool.query(
      'SELECT employer_id FROM jobs WHERE job_id=$1',
      [jobId]
    );
    console.log(employerId);
    // Get email from users
    const { rows: employerEmail } = await pool.query(
      'SELECT email FROM users WHERE user_id=$1',
      [employerId[0].employer_id]
    );
    // console.log('EMPLOYER EMAILL OR SO ---<<>>> ', employerEmail);
    // jobInfo.employerEmail = employerEmail[0].email;
    return employerEmail[0].email;
  } catch (error) {
    console.log('Helper function getEmployerEmail error --> ', error);
  }

};

const getJobsPendingInterest = async (userId) => {
  const listOfPendingJobs = [];

  // Retrieve all jobs from pending_jobs table relating to user
  const {rows: listOfPendingJobIds} = await pool.query('SELECT job_id FROM pending_jobs WHERE employee_id=$1', [userId]);

  // Retrieve all jobs relating to user from jobs table based on returned jobs_id
  listOfPendingJobIds.forEach(jobId => {
    listOfPendingJobs.push(
      pool.query('SELECT * FROM jobs WHERE job_id=$1', [jobId.job_id])
    );
  })

  return listOfPendingJobs;
};

const getJobsPendingPosted = async (userId) => {

  // Retireve all jobs in pending_table
  const { rows: listOfPendingJobIds } = await pool.query(
    'SELECT job_id FROM pending_jobs WHERE employee_id=$1',
    [userId]
  );
}

export { getEmployerEmail, getJobsPendingInterest };