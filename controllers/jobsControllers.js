import pool from '../model/db.js';

export const viewJobs = async (req, res) => {
  const {page} = req.query;
  const {limit} = req.query;
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
  const values = [userId, salary, location, jobCat, jobInfo];


  try {
      const { rows } = await pool.query(
        'INSERT INTO jobs (employer_id, salary, job_location, job_cat, job_info) VALUES ($1, $2, $3 ,$4, $5) RETURNING *',
        values
      );
    // res.json(rows)
    res.redirect(`/profile/${userId}`)
  } catch (err) {
    res.json(err)
  }
  // res.json(req.body);
};

export const postInterestForJob = (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render('homePage/login', {title: 'Log In', logInErr: 'Oopsie!! You have to log in to send an interest!'})
    return;
  }
  res.send('Send email to job creator notifyting that this person is interested in taking up the job')
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

