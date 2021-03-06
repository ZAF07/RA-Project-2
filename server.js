/* eslint-disable no-console */
/* eslint-disable import/extensions */
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import {} from 'dotenv/config';

// Import Routers
import homeRouters from './routes/homeRouters.js';
import jobsRouters from './routes/jobsRouters.js';
// import bindHomeRoutes from './routes.mjs';

const app = express();
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));
app.use('/', homeRouters);
app.use('/jobs', jobsRouters);
// bindHomeRoutes(app);

app.listen(
  process.env.PORT || 3000,
  console.log(`Listening on http://localhost:${process.env.PORT}`),
);
