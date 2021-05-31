import pool from '../model/db.js';
import jsSHA from 'jssha';
import bcrypt from 'bcryptjs';

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
    const {password, email, user_id} = rows[0];

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
         // Redirect to profile page
         res.json({ msg: 'SUCCESS', password, email, user_id });
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
        // New User created and stored in rows
        res.json({
          rows,
          toDo: 'Create a profile page where there are two pages. One for jobs posted and one for jobs accepted',
        });

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