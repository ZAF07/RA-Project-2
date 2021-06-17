/* eslint-disable import/extensions */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable camelcase */

import jsSHA from 'jssha';
import bcrypt from 'bcryptjs';
import path from 'path';
import pool from '../model/db.js';

const userInfo = {};

export const home = (req, res) => {
  const { userId } = req.cookies;
  const { isLoggedIn } = req.session;
  res.render('homePage/home', {
    title: 'home',
    isUserLoggedIn: isLoggedIn,
    userId,
  });
};

export const register = (req, res) => {
  const { isLoggedIn } = req.session;

  res.render('homePage/register', {
    title: 'Register an account!',
    isUserLoggedIn: isLoggedIn,
    instructions: 'Create Home Page. Describe what this page is about.',
  });
};

export const login = (req, res) => {
  res.render('homePage/login', { title: 'Log In' });
};

export const postLogin = async (req, res) => {
  // Check referer pathname to redirect to after successful authentication
  const { referer } = req.headers;
  console.log('REFERER --->>>> ', referer);

  // Retrieve user details
  const { email: userEmail } = req.body;
  const { password: userPassword } = req.body;
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
    // userInfo.email = email;
    // userInfo.userId = user_id;
    // setting user id in cookie
    res.cookie('userId', user_id);
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
            'Logged in from view Jobs page after clicking Im Interest! ->  Send email to job creator notifyting that this person is interested in taking up the job. Redirect to profile page and show dashboard',
          );

          return;
        }

        // Redirect to profile page

        // populating global user obj for user profile controller to use after redirect
        // userInfo.email = email;
        // userInfo.userId = user_id;

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

    res.send('Create error page');
  }
};

export const postLogOut = (req, res) => {
  // reset all global user properties
  userInfo.isActive = true;
  userInfo.userId = '';
  userInfo.email = '';
  userInfo.listOfjobsCompleted = '';
  userInfo.listOfJobsPosted = '';
  userInfo.listOfJobsPendingPosted = '';
  userInfo.listOfJobsPendingApplied = '';
  userInfo.totalSpent = '';
  userInfo.totalEarned = '';

  res.clearCookie('userId');
  req.session.destroy((err) => {
    res.redirect('/');
  });
};

export const postRegister = async (req, res) => {
  // retrieve user info from body
  const { email, password } = req.body;

  // get referer path
  const { referer } = req.headers;
  console.log(path.basename(referer));
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
        [email, hash],
      );

      const { rows: userDetails } = await pool.query(
        'SELECT * FROM users  WHERE email=$1', [email],
      );

      // set 'inactive' status to new user so ejs knows to display msg to nudge user to set/get jobs
      if (path.basename(referer) === 'register') {
        userInfo.isActive = false;
      }
      // populating global user obj for user profile controller to use after redirect
      // userInfo.email = userDetails[0].email;
      // userInfo.userId = userDetails[0].user_id;
      console.log('THIS IS FROM REGISTER ROUTE =--=-=-=-=> ', userDetails[0]);

      // Create session and cookie here
      if (!req.session.isLoggedIn) {
        // setting user id in cookie
        res.cookie('userId', userDetails[0].user_id);
        req.session.isLoggedIn = true;
      }
      res.status(200).redirect(`/profile/${userDetails[0].user_id}`);
      return;
    }
    // redirect to register page with err msg if user already exists
    res.render('homePage/register', {
      title: 'Register an account!',
      registerErr:
          'A user with the email address already exists. Sign in or create a new account here',
    });
    // res.send('User already exists. Render register page with user exists err msg')

    return;
  } catch (error) {
    console.log('ERROR FROM postRegister query --> ', error);
    res.send(error);
  }
};

// // Gather user info for profile page
const gatherUserInfo = async (userId) => {
  const userInfo = {};

  const { rows: userEmail } = await pool.query('SELECT email FROM users WHERE user_id=$1', [userId]);

  // //SELECT * FROM jobs WHERE employee_id=user_id; -> jobs taken
  const { rows: listOfjobsCompleted } = await pool.query(
    'SELECT * FROM job_details WHERE employee_id=$1 AND job_status=$2',
    [userId, 'completed'],
  );
  // //SELECT * FROM jobs WHERE employer_id=user_id; -> jobs posted
  const { rows: listOfJobsPosted } = await pool.query(
    'SELECT * FROM jobs WHERE employer_id=$1',
    [userId],
  );
  // SELECT * FROM jobs WHERE employer_id=user_id AND job_status='pending'-> pending approval (posted)
  const { rows: listOfJobsPendingPosted } = await pool.query(
    'SELECT * FROM jobs WHERE employer_id=$1 AND job_status=$2',
    [userId, 'open'],
  );

  const { rows: listOfJobsPendingApplied } = await pool.query(
    'SELECT * FROM job_details WHERE employee_id=$1 AND job_status=$2',
    [userId, 'interested'],
  );

  // SELECT salary FROM jobs WHERE employer_id=user_id; -> total spent
  const { rows: listOfAmtSpent } = await pool.query(
    'SELECT salary FROM jobs WHERE employer_id=$1 AND job_status=$2',
    [userId, 'completed'],
  );
  // //SELECT salary FROM jobs WHERE employee_id=user_id; -> total earned
  const { rows: totalAmtEarned } = await pool.query(
    'SELECT salary FROM jobs WHERE employee_id=$1 AND job_status=$2',
    [userId, 'completed'],
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

  // if (listOfjobsCompleted.length < 2) {
  //   console.log('--->', listOfjobsCompleted.length);
  //   userInfo.isActive = false;
  // }

  userInfo.listOfjobsCompleted = listOfjobsCompleted;
  userInfo.listOfJobsPosted = listOfJobsPosted;
  userInfo.listOfJobsPendingPosted = listOfJobsPendingPosted;
  userInfo.listOfJobsPendingApplied = listOfJobsPendingApplied;
  userInfo.totalSpent = totalSpent;
  userInfo.totalEarned = totalEarned;
  userInfo.userId = userId;
  userInfo.email = userEmail[0].email;

  console.log('jobsPendingPosted --->>', userInfo.listOfJobsPendingPosted);
  //  console.log('jobsPendingApplied --->>', userInfo.listOfJobsPendingApplied);
  console.log('totalSpent --->>', userInfo.totalSpent);
  console.log('totalEarned --->>', userInfo.totalEarned);
  console.log('isActive --->> ', userInfo.isActive);

  return userInfo;
};

export const userProfile = async (req, res) => {
  // if no session ID redirect home
  if (!req.session.isLoggedIn) {
    res.status(403).redirect('/');
  }
  // gather user info
  const { userId } = req.cookies;
  const userInfo = await gatherUserInfo(userId);
  console.log('WAWAWAWAAWWWWA =======>>>>> ', userInfo.email);

  console.log('this hsoudf fsdj ==> ', userInfo.userId);
  res.render('user/profile', {
    title: 'User ID',
    email: userInfo.email,
    jobsTaken: userInfo.listOfjobsCompleted,
    jobsPosted: userInfo.listOfJobsPosted,
    jobsPendingPosted: userInfo.listOfJobsPendingPosted,
    jobsPendingApplied: userInfo.listOfJobsPendingApplied,
    totalSpent: userInfo.totalSpent,
    totalEarned: userInfo.totalEarned,
    isActive: userInfo.isActive,
    isUserLoggedIn: true,
    userId: userInfo.userId,
  });
};

// RA CONTROLLERS

const initHomeController = (db) => {
  const index = (req, res) => {
    const { userId } = req.cookies;
    const { isLoggedIn } = req.session;
    res.render('homePage/home', {
      title: 'home',
      isUserLoggedIn: isLoggedIn,
      userId,
    });
  };
  return {
    index,
  };
};

export { initHomeController };
// export const home = (req, res) => {
//   const { userId } = req.cookies;
//   const { isLoggedIn } = req.session;
//   res.render('homePage/home', {
//     title: 'home',
//     isUserLoggedIn: isLoggedIn,
//     userId,
//   });
// };
