import pool from '../model/db.js';
import sendMail from '../nodemailer/mail.js';
import {getEmployerEmail} from '../helper/helper.js';

const jobInfo = {};

export const viewJobs = async (req, res) => {
  const {page, limit} = req.query;
  const isLoggedIn = req.session.isLoggedIn;
  console.log('here ---<< ', req.session.isLoggedIn);

  // indexes to determine where in retrieved result array from DB to start
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let numOfPaginationLinks = 0;
  const { rows } = await pool.query('SELECT * FROM jobs');
  console.log(' here data -->', rows); // ARRAY

  const calcRows = Math.ceil(11 / limit);
  console.log(`Number of pages -> ${calcRows}`);

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
  });
};

export const createJob = async (req, res) => {  
  const {userId, salary, location, jobCat, jobInfo} = req.body;
  const values = [userId, salary, location, jobCat, jobInfo, 'pending'];


  try {

    // create job in jobs table
      const { rows: newJobInfo } = await pool.query(
        'INSERT INTO jobs (employer_id, salary, job_location, job_cat, job_info, job_status) VALUES ($1, $2, $3 ,$4, $5, $6) RETURNING *',
        values
      );
      console.log(newJobInfo[0]);

    // // create pending job status in pending_jobs status
    // const { rows: pendingJobsPosted } = await pool.query(
    //   'INSERT INTO pending_jobs (job_id) VALUES($1)',
    //   [newJobInfo[0].job_id]
    // );


    // res.json(rows)
    res.redirect(`/profile/${userId}`)
  } catch (err) {
    console.log('Error from createJob -->> ', err);
    res.json(err)
  }
  // res.json(req.body);
};

export const postInterestForJob = async (req, res) => {

  // retrieve job id from user input
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
    const { rows: pendingJobsPosted } = await pool.query(
      'INSERT INTO pending_jobs (job_id, employee_id) VALUES($1, $2)',
      [jobId, employeeId]
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

export const jobDetails = (req, res) => {


  // If not logged in / not registered render login form with error message
  if (!req.session.isLoggedIn) {
    res.render('homePage/login', {
      title: 'Log In',
      logInErr: 'Oopsie!! You have to log in to send an interest!',
    });
    return;
  }

  res.render('jobsPage/jobdetails', { title: 'Details' });
}