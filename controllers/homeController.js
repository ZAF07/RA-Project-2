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
    title: 'home',
    instructions: 'Create Home Page. Describe what this page is about.',
  });
};

export const login = (req, res) => {
  res.render('homePage/login', {title: 'Log In'})
}
export const postLogin = (req, res) => {
  if (!req.cookie) {
    res.render('homePage/login', { title: 'Log In', logInErr: 'No such User. Please Create a new account' });
    return;
  }
  res.json('req.body');
};