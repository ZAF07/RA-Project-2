/* eslint-disable import/extensions */
/* eslint-disable no-console */
import pool from '../model/db.js';

// eslint-disable-next-line consistent-return
export const getEmployerEmail = async (jobId) => {
  try {
    // Get employer_id from jobs
    const { rows: employerId } = await pool.query(
      'SELECT employer_id FROM jobs WHERE job_id=$1',
      [jobId],
    );
    console.log(employerId);
    // Get email from users
    const { rows: employerEmail } = await pool.query(
      'SELECT email FROM users WHERE user_id=$1',
      [employerId[0].employer_id],
    );

    return {
      employerEmail: employerEmail[0].email,
      employerId: employerId[0].employer_id,
    };
  } catch (error) {
    console.log('Helper function getEmployerEmail error --> ', error);
  }
};

export const getEmployeeEmail = async (employeeId) => {
  const { rows: employeeEmail } = await pool.query('SELECT email from users WHERE user_id=$1', [employeeId]);
  console.log('THIOS IS EMPLOYEE MAIL ==> ', employeeEmail[0].email);
  return employeeEmail[0].email;
};
