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

export const postRegister = async (req, res) => {
  // retrieve user info from body
  const { email, password } = req.body;

  // check if user already exists
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [
        email,
      ]);
      if (!rows.length) {
        const { rows } = await pool.query(
          'INSERT INTO users (email, password) VALUES($1,$2) RETURNING *',
          [email, password]
        );
        // New User created and stored in rows
        res.json({rows,
        toDo: 'Create a profile page where there are two pages. One for jobs posted and one for jobs accepted'});
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