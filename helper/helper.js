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

export {getEmployerEmail};