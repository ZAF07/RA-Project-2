import pool from '../model/db.js';

export const viewJobs = async (req, res) => {
  let numOfPaginationLinks = 0;
  const { rows } = await pool.query('SELECT * FROM jobs');
  console.log(' here data -->', rows); // ARRAY

  const calcRows = Math.ceil(11 / 5);
  console.log(`Number of pages -> ${calcRows}`);

  // Get from DB array containing the list of jobs
  // Calculate number of pagination pages needed if i want to display 5 jobs per page
  // Takes rows returned from pg wuery
  // returns: sets numOfPaginationLinks to == number of pagination link button needed
  const calculateNumberOfPages = (arrOfJobsFromPg) => {
    if (arrOfJobsFromPg.length <= 2) {
      numOfPaginationLinks = 1;
    } else {
      numOfPaginationLinks = Math.ceil(arrOfJobsFromPg.length / 2);
    }
  };
  calculateNumberOfPages(rows);

  // Split into smaller arrays
  let jobsToDisplay;

  // FIND A WAY TO PERFORM DYNAMIC PAGINATION
  // const numberOfListings = currentPage

  // Check current page param and splice array accordingly
  const currentPage = req.params.page;
  if (currentPage == 1) {
    jobsToDisplay = rows.splice(0, 2);
  } else if (currentPage == 2) {
    jobsToDisplay = rows.splice(2, 2);
  }

  console.log('HERE IS WAHT IM SENDING', jobsToDisplay);

  console.log('Final pagination count --> ', numOfPaginationLinks);

  console.log(currentPage);
  res.render('jobsPage/viewJobs', {
    title: 'Jobs',
    jobs: jobsToDisplay,
    numOfPaginationLinks,
  });
};

export const createJob = async (req, res) => {  
  const {salary, location, jobCat, jobInfo} = req.body;
  const values = [1, salary, location, jobCat, jobInfo];


  try {
      const { rows } = await pool.query(
        'INSERT INTO jobs (employer_id, salary, job_location, job_cat, job_info) VALUES ($1, $2, $3 ,$4, $5) RETURNING *',
        values
      );
    res.json(rows)
  } catch (err) {
    res.json(err)
  }
  // res.json(req.body);
};


export const postInterestForJob = (req, res) => {
  if (!req.cookies) {
    res.render('homePage/login', {title: 'Log In', logInErr: 'Oopsie!! You have to log in to send an interest!'})
    return;
  }
  res.send('Send email to job creator notifyting that this person is interested in taking up the job')
}

export const postCreateJob = (req, res) => {
  if (!req.cookies) {
    // res.send('Create a form for users to post new jobs');
    // res.render('homePage/login', {
    //   title: 'Log In',
    //   logInErr: 'Oopsie!! You have to log in to send an interest!',
    // });

    res.render('jobsPage/createJobForm', { title: 'Create A New Job' });
    return;
  }
  
  res.render('jobsPage/createJobForm', {title: 'Create A New Job'})
};

