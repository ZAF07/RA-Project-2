import express from 'express';
import session from 'express-session';
import pg from 'pg';
import {} from 'dotenv/config';
const { pool } = pg;

// Import Routers
import homeRouters from './routes/homeRouters.js';
import jobsRouters from './routes/jobsRouters.js';

const app = express();

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false}
}))

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./public'))
app.use(express.urlencoded({extended: false}))
app.use('/', homeRouters);
app.use('/jobs', jobsRouters);

app.listen(
  process.env.PORT,
  console.log(`Listening on http://localhost:${process.env.PORT}`)
);
