import pool from '../model/db.js';
import jsSHA from 'jssha';

export const home = (req, res) => {
  res.render('homePage/home', {
    title: 'home',
    instructions: 'Create Home Page. Describe what this page is about.',
  });
};

export const register = (req, res) => {
  res.render('homePage/register', {
    title: 'Register an account!',
    instructions: 'Create Home Page. Describe what this page is about.',
  });
};

export const login = (req, res) => {
  res.render('homePage/login', {title: 'Log In'})
}
export const postLogin = (req, res) => {
  if (!req.cookie) {
    res.render('homePage/register', {
      title: 'Register an account!',
      registerErr: 'We could\'nt find a user that matches. Please Create a new account here',
    });
    return;
  }
  res.json('req.body');
};

export const postRegister = (req, res) => {
  // retrieve user info from body

  // check if user already exists
    // redirect to register page with err msg
  
  // if not user exists, hash password and save to DB
  
  // Redirect to profile page or viewJobs Page

  res.send('Handle errors and save user if no errors')
}