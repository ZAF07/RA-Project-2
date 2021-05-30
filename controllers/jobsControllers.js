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

export const postInterestForJob = (req, res) => {
  if (!req.cookies) {
    res.render('homePage/login', {title: 'Log In', logInErr: 'Oopsie!! You have to log in to send an interest!'})
    return;
  }
  res.send('Welcome')
}

