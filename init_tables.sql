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

CREATE TYPE status AS ENUM ('pending', 'done', 'canceled');
CREATE TABLE IF NOT EXISTS jobs (
  job_id SERIAL PRIMARY KEY,
  employer_id INT,
  employee_id INT[],
  salary INT,
  job_location TEXT,
  job_cat TEXT,
  job_info TEXT,
  job_status status,
  date DATE
);