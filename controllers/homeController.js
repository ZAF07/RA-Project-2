import pool from '../model/db.js';
import jsSHA from 'jssha';
import bcrypt from 'bcryptjs';
import path from 'path';


const userInfo = {};

export const home = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render('homePage/home', {
    title: 'home',
    isUserLoggedIn: isLoggedIn,
    instructions: 'Create Home Page. Describe what this page is about.',
  });
};

export const register = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  res.render('homePage/register', {
    title: 'Register an account!',
    isUserLoggedIn: isLoggedIn,
    instructions: 'Create Home Page. Describe what this page is about.',
  });
};

export const login = (req, res) => {
  res.render('homePage/login', {title: 'Log In'})
}

export const postLogin = async (req, res) => {

  // Check referer pathname to redirect to after successful authentication
  const {referer} = req.headers;
  console.log(path.basename(referer));


  // Retrieve user details
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  console.log(userPassword);

  // Check if user exists
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [
      userEmail,
    ]);

    // redirect to register page if no user exists
    if (!rows.length) {
      res.render('homePage/register', {
        title: 'Register an account!',
        registerErr:
          "We could'nt find a user that matches. Please Create a new account here",
      });
      return;
    }

    // if user exists, decrypt password, if password matches,set cookie and session then redirect to profile page
    const { password, email, user_id } = rows[0];
    // populating global user obj for user profile controller to use after redirect
    userInfo.email = email;
    userInfo.userId = user_id;
    // compare password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userPassword, salt);
    console.log(bcrypt.compareSync(userPassword, password));

    bcrypt.compare(userPassword, password).then((hashResult) => {
      if (hashResult) {
        // Create session and cookie here
        if (!req.session.isLoggedIn) {
          req.session.isLoggedIn = true;
        }

        // Check if referer of request is from /create-form, if so redirect back
        if (path.basename(referer) === 'create-job?') {
          res.redirect('jobs/create-job');
          return;
        }
        if (path.basename(referer) === 'jobs') {
          // res.redirect('jobs/create-job');
          res.send(
            'Logged in from view Jobs page after clicking Im Interest! ->  Send email to job creator notifyting that this person is interested in taking up the job. Redirect to profile page and show dashboard'
          );
          return;
        }

        // Redirect to profile page

        // populating global user obj for user profile controller to use after redirect
        userInfo.email = email;
        userInfo.userId = user_id;

        res.status(200).redirect(`/profile/${user_id}`);
        return;
      }
      // If user doesn't exist render login page with error
      res.render('homePage/login', {
        title: 'Log In',
        logInErr: 'Oops! Looks like your password did not match! Try again? ',
      });
    });
  } catch (error) {

    // This could be server error
    console.log('ERROR FROM postLogin --> ', error);
          // res.render('homePage/login', {
          //   title: 'Log In',
          //   registerErr:
          //     "Oops! Looks like your password did not match! Try again? ",
          // });
          res.send('Create error page')
  }
};

export const postLogOut = (req, res) => {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
}

export const postRegister = async (req, res) => {
  // retrieve user info from body
  const { email, password } = req.body;

  // check if user already exists
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [
        email,
      ]);
      
      // if user !exists in DB, hash password, save user in DB and redirect to profile page
      if (!rows.length) {
        // JsSHA
        // // Hash and salt
        // const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
        // shaObj.update(password);
        // // hashed password
        // const hash = shaObj.getHash('HEX');

        // BCRYPT
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const { rows } = await pool.query(
          'INSERT INTO users (email, password) VALUES($1,$2) RETURNING *',
          [email, hash]
        );

        const { rows: userDetails } = await pool.query(
          'SELECT * FROM users  WHERE email=$1', [email]
        );

        // populating global user obj for user profile controller to use after redirect
        userInfo.email = userDetails.email;
        userInfo.userId = userDetails.user_id;

        // Create session and cookie here
        if (!req.session.isLoggedIn) {
          req.session.isLoggedIn = true;
        }
        res.status(200).redirect(`/profile/${userInfo.userId}`);
        return;
        // New User created and stored in rows
        // res.json({
        //   rows,
        //   toDo: 'Create a profile page where there are two pages. One for jobs posted and one for jobs accepted',
        // });

        //

        return;
      }
      // redirect to register page with err msg if user already exists
      res.render('homePage/register', {
        title: 'Register an account!',
        registerErr:
          'A user with the email address already exists. Sign in or create a new account here',
      });
      //res.send('User already exists. Render register page with user exists err msg')

      return;
    } catch (error) {
      console.log('ERROR FROM postRegister query --> ', error);
      res.send(error)
    }

  
  // if not user exists, hash password and save to DB
  
  // Redirect to profile page or viewJobs Page

  // res.json({email, password})
}

export const userProfile = async (req, res) => {
  //SELECT * FROM jobs WHERE employee_id=user_id; -> jobs taken
  const { rows: listOfjobsTaken } = await pool.query(
    'SELECT * FROM jobs WHERE employee_id=$1',
    [userInfo.userId]
  );
  //SELECT * FROM jobs WHERE employer_id=user_id; -> jobs posted
  const { rows: listOfJobsPosted } = await pool.query(
    'SELECT * FROM jobs WHERE employer_id=$1',
    [userInfo.userId]
  );
  //SELECT * FROM jobs WHERE employer_id=user_id AND job_status='pending'-> pending approval (posted)
  const { rows: listOfJobsPendingPosted } = await pool.query(
    'SELECT * FROM jobs WHERE employer_id=$1 AND job_status=$2',
    [userInfo.userId, 'pending']
  );
  //SELECT * FROM jobs WHERE employee_id=user_id; AND job_status='pending' -> pending approval (applied)
  const { rows: listOfJobsPendingApplied } = await pool.query(
    'SELECT * FROM jobs WHERE employee_id=$1 AND job_status=$2',
    [userInfo.userId, 'pending']
  );
  //SELECT salary FROM jobs WHERE employer_id=user_id; -> total spent
  const { rows: listOfAmtSpent } = await pool.query(
    'SELECT salary FROM jobs WHERE employer_id=$1',
    [userInfo.userId]
  );
  //SELECT salary FROM jobs WHERE employee_id=user_id; -> total earned
  const { rows: totalAmtEarned } = await pool.query(
    'SELECT salary FROM jobs WHERE employee_id=$1',
    [userInfo.userId]
  );

  // calculate total amount spent / earned
  let totalSpent = 0;
  let totalEarned = 0;

  listOfAmtSpent.forEach((amt) => {
    totalSpent += amt.salary;
  });
  totalAmtEarned.forEach((amt) => {
    totalEarned += amt.salary;
  });

  // if no session ID redirect home
  if (!req.session.isLoggedIn) {
    res.status(403).redirect('/');
  }
  console.log(typeof listOfjobsTaken.length);
  // res.json({ here: listOfJobsPosted.length, there: listOfjobsTaken.length });
  res.render('user/profile', {
    title: 'User ID',
    email: userInfo.email,
    jobsTaken: listOfjobsTaken,
    jobsPosted: listOfJobsPosted,
    jobsPendingPosted: listOfJobsPendingPosted,
    jobsPendingApplied: listOfJobsPendingApplied,
    totalSpent,
    totalEarned,
  });
}