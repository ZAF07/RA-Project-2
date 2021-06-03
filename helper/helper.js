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

// Gather user info for profile page
// const gatherUserInfo = async (userId) => {
//   //SELECT * FROM jobs WHERE employee_id=user_id; -> jobs taken
//   const { rows: listOfjobsTaken } = await pool.query(
//     'SELECT * FROM jobs WHERE employee_id=$1',
//     [userInfo.userId]
//   );
//   //SELECT * FROM jobs WHERE employer_id=user_id; -> jobs posted
//   const { rows: listOfJobsPosted } = await pool.query(
//     'SELECT * FROM jobs WHERE employer_id=$1',
//     [userInfo.userId]
//   );
//   //SELECT * FROM jobs WHERE employer_id=user_id AND job_status='pending'-> pending approval (posted)
//   const { rows: listOfJobsPendingPosted } = await pool.query(
//     'SELECT * FROM jobs WHERE employer_id=$1 AND job_status=$2',
//     [userInfo.userId, 'pending']
//   );
//   //SELECT * FROM jobs WHERE employee_id=user_id; AND job_status='pending' -> pending approval (applied)
//   const { rows: listOfJobsPendingApplied } = await pool.query(
//     'SELECT * FROM jobs WHERE employee_id=$1 AND job_status=$2',
//     [userInfo.userId, 'pending']
//   );
//   //SELECT salary FROM jobs WHERE employer_id=user_id; -> total spent
//   const { rows: listOfAmtSpent } = await pool.query(
//     'SELECT salary FROM jobs WHERE employer_id=$1',
//     [userInfo.userId]
//   );
//   //SELECT salary FROM jobs WHERE employee_id=user_id; -> total earned
//   const { rows: totalAmtEarned } = await pool.query(
//     'SELECT salary FROM jobs WHERE employee_id=$1',
//     [userInfo.userId]
//   );

//   // calculate total amount spent / earned
//   let totalSpent = 0;
//   let totalEarned = 0;

//   listOfAmtSpent.forEach((amt) => {
//     totalSpent += amt.salary;
//   });
//   totalAmtEarned.forEach((amt) => {
//     totalEarned += amt.salary;
//   });

//   if (listOfjobsTaken.length < 2) {
//     console.log('--->', listOfjobsTaken.length);
//     userInfo.isActive = false;
//   }

//   //  userInfo.listOfjobsTaken = listOfjobsTaken;
//   //  userInfo.listOfJobsPosted = listOfJobsPosted;
//   //  userInfo.listOfJobsPendingPosted = listOfJobsPendingPosted;
//   //  userInfo.listOfJobsPendingApplied = listOfJobsPendingApplied;
//   //  userInfo.totalSpent = totalSpent
//   //  userInfo.totalEarned = totalEarned

//   // return object
//   return {
//     listOfjobsTaken: listOfjobsTaken,
//     listOfJobsPosted: listOfJobsPosted,
//     listOfJobsPendingPosted: listOfJobsPendingPosted,
//     listOfJobsPendingApplied: listOfJobsPendingApplied,
//     totalSpent: totalSpent,
//     totalEarned: totalEarned,
//   };

//   console.log('jobsTaken --->>', userInfo.listOfjobsTaken.length);
//   console.log('jobsPosted --->>', userInfo.listOfJobsPosted.length);
//   console.log('jobsPendingPosted --->>', userInfo.listOfJobsPendingPosted);
//   console.log('jobsPendingApplied --->>', userInfo.listOfJobsPendingApplied);
//   console.log('totalSpent --->>', userInfo.totalSpent);
//   console.log('totalEarned --->>', userInfo.totalEarned);
//   console.log('isActive --->> ', userInfo.isActive);
// };

export { getEmployerEmail };