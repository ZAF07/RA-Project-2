DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS pending_jobs;
DROP TABLE IF EXISTS completed_jobs;
DROP TABLE IF EXISTS canceled_jobs;
DROP TABLE IF EXISTS job_details;
DROP TYPE IF EXISTS job_detail_status;

CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  email TEXT,
  password TEXT
);

-- CREATE TYPE status AS ENUM ('pending', 'done', 'canceled');
-- CREATE TABLE IF NOT EXISTS jobs (
--   job_id SERIAL PRIMARY KEY,
--   employer_id INT,
--   employee_id INT,
--   salary INT,
--   job_location TEXT,
--   job_cat TEXT,
--   job_info TEXT,
--   job_status status,
--   date DATE
-- );

CREATE TYPE status AS ENUM ('open', 'started', 'completed', 'canceled');
CREATE TABLE IF NOT EXISTS jobs (
  job_id SERIAL PRIMARY KEY,
  employer_id INT,
  employee_id INT,
  salary INT,
  job_location TEXT,
  job_cat TEXT,
  job_info TEXT,
  job_status status,
  date DATE
);

CREATE TYPE job_detail_status AS ENUM ('completed', 'cancelled', 'interested', 'started');
CREATE TABLE job_details (
  id SERIAL PRIMARY KEY,
  job_id INT,
  employee_id INT,
  job_status job_detail_status
);

-- CREATE TABLE IF NOT EXISTS pending_jobs (
--   pending_id SERIAL PRIMARY KEY,
--   job_id INT,
--   employee_id INT
-- );

-- CREATE TABLE IF NOT EXISTS completed_jobs (
--   completed_id SERIAL PRIMARY KEY,
--   job_id INT,
--   employee_id INT
-- );

-- CREATE TABLE IF NOT EXISTS canceled_jobs (
--   canceled_id SERIAL PRIMARY KEY,
--   job_id INT,
--   employee_id INT
-- );

-- TO GET LIST OF PENDING JOB EMPLOYEE

-- get all pending job_id from pending_jobs table
-- SELECT job_id from pending_jobs;

-- then get all jobs from jobs table 
-- SELECT * FROM jobs WHERE job_id=$1, [job_id]

--  ###


-- TO GET LIST OF PENDING JOBS FOR EMPLOYER 

-- SELECT job_id from pending_jobs;

--  then get all jobs from jobs table with user_id and job_id
-- SELECT * FROM jobs WHERE job_id=$1 AND employer_id=$2, [job_id, user_id];


-- ###
