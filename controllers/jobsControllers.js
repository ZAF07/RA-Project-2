import pool from '../model/db.js';
import sendMail from '../nodemailer/mail.js';
import { getEmployerEmail, getJobsPendingInterest } from '../utils/helper.js';

const jobInfo = {};

export const viewJobs = async (req, res) => {
  const { page, limit } = req.query;
  const { userId } = req.cookies;
  console.log('USER IS HERE viewJobs --->> ', userId);
  const isLoggedIn = req.session.isLoggedIn;
  console.log('is logged in ? ---<< ', req.session.isLoggedIn);

  // indexes to determine where in retrieved result array from DB to start
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  let numOfPaginationLinks = 0;

  // if (!req.session.isLoggedIn) {
  //   const { rows } = await pool.query(
  //     'SELECT * FROM jobs WHERE job_status=$1',
  //     ['open']
  //   );
  // }

  // Select only jobs with 'OPEN' status and != current userId
  const { rows } = await pool.query(
    'SELECT * FROM jobs WHERE job_status=$1 AND employer_id <>$2',
    ['open', userId]
  );
  console.log(' here data -->', rows); // ARRAY

  // const calcRows = Math.ceil(11 / limit);
  // console.log(`Number of pages -> ${calcRows}`);

  // Get from DB array containing the list of jobs
  // Calculate number of pagination pages needed if i want to display 5 jobs per page
  // Takes rows returned from pg wuery
  // returns: sets numOfPaginationLinks to == number of pagination link button needed
  const calculateNumberOfPages = (arrOfJobsFromPg) => {
    if (arrOfJobsFromPg.length <= limit) {
      numOfPaginationLinks = 1;
    } else {
      numOfPaginationLinks = Math.ceil(arrOfJobsFromPg.length / limit);
    }
  };
  calculateNumberOfPages(rows);

  // Split into smaller arrays
  let jobsToDisplay = rows.slice(startIndex, endIndex);

  console.log('HERE IS WAHT IM SENDING', jobsToDisplay);

  console.log('Final pagination count --> ', numOfPaginationLinks);

  // console.log(currentPage);
  res.render('jobsPage/viewJobs', {
    title: 'Jobs',
    isUserLoggedIn: isLoggedIn,
    jobs: jobsToDisplay,
    numOfPaginationLinks,
    currentPage: parseInt(page),
    userId
  });
};

export const createJob = async (req, res) => {  

  //gather job details from user input
  const {userId, salary, location, jobCat, jobInfo} = req.body;
  const values = [userId, salary, location, jobCat, jobInfo, 'open'];


  try {

    // create job in jobs table setting job_status as open
      const { rows: newJobInfo } = await pool.query(
        'INSERT INTO jobs (employer_id, salary, job_location, job_cat, job_info, job_status) VALUES ($1, $2, $3 ,$4, $5, $6) RETURNING *',
        values
      );
      console.log(newJobInfo[0]);

      
    res.redirect(`/profile/${userId}`)
  } catch (err) {
    console.log('Error from createJob -->> ', err);
    res.json(err)
  }
};

export const postInterestForJob = async (req, res) => {

  // retrieve job id
  const { jobId } = req.body;
  const employeeId = req.cookies.userId;

  // If not logged in / not registered render login form with error message
  if (!req.session.isLoggedIn) {
    res.render('homePage/login', {title: 'Log In', logInErr: 'Oopsie!! You have to log in to send an interest!'})
    return;
  }
  try {
    jobInfo.employerEmail = await getEmployerEmail(jobId);

    // If logged in, send notification to job creater aka employer
    await sendMail(employeeId, jobInfo.employerEmail);

    // update jobs table where job_id === jobId
    // await pool.query('UPDATE jobs SET employee_id=$1 WHERE job_id=$2', [
    //   employeeId,
    //   jobId,
    // ]);

    // Update pending_jobs table to show this job as currently pending
    // await pool.query('UPDATE pending_jobs SET employee_id=$1 WHERE job_id=$2', [
    //   employeeId,
    //   jobId,
    // ]);
    // create new pending job row in pending_jobs table
    // const { rows: pendingJobsPosted } = await pool.query(
    //   'INSERT INTO pending_jobs (job_id, employee_id) VALUES($1, $2)',
    //   [jobId, employeeId]
    // );

    // create new row in 'job_details' table (sending an interest for a job)
    const { rows: pendingJobsPosted } = await pool.query(
      'INSERT INTO job_details (job_id, employee_id, job_status) VALUES($1, $2, $3)',
      [jobId, employeeId, 'interested']
    );


    // redirect user to profile page with success message
    res.redirect(`/profile/${employeeId}`);
    // res.send(
    //   'Send email to job creator notifyting that this person is interested in taking up the job'
    // );
  } catch (error) {
    res.redirect('/')
    console.log('NODEMAILER ERROR --> ',error);
  }

}

export const postCreateJobForm = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (!req.session.isLoggedIn) {

    res.render('homePage/login', {
      title: 'Log In',
      logInErr: 'Whoops!! You have to log in to create a new job!',
    });
    return;

    // res.render('jobsPage/createJobForm', { title: 'Create A New Job' });
    // return;
  }
  
  res.render('jobsPage/createJobForm', {title: 'Create A New Job', isUserLoggedIn: isLoggedIn, userId: req.cookies.userId})
};

export const jobDetails = async (req, res) => {
  const { userId } = req.cookies;

  // If not logged in / not registered render login form with error message
  if (!req.session.isLoggedIn) {
    res.render('homePage/login', {
      title: 'Log In',
      logInErr: 'Oopsie!! You have to log in to send an interest!',
    });
    return;
  }

  const { rows: listOfJobsPendingApplied } = await pool.query(
    'SELECT jobs.job_id, job_info, job_location, salary, job_cat FROM jobs join job_details ON jobs.job_id = job_details.job_id WHERE job_details.employee_id=$1 AND job_details.job_status=$2',
    [userId, 'interested']
  );

  

 
  

  res.render('jobsPage/jobdetails', {
    title: 'Details',
    userId: userId,
    jobId: listOfJobsPendingApplied.length ? listOfJobsPendingApplied[0].job_id : null,
    listOfJobsPendingApplied,
  });
}

export const deleteOneJob = async (req, res) => {
  const {jobId, userId} = req.body;

  const {rows: deletedJobIntest} = pool.query('DELETE FROM job_details WHERE job_id=$1 AND employee_id=$2 RETURNING *', [jobId, userId]);


  res.redirect(`/profile/${userId}`);
}

