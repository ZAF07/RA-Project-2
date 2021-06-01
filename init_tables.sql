CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  email TEXT,
  password TEXT
);

CREATE TYPE status AS ENUM ('pending', 'done', 'canceled');
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

-- insert into jobs (employer_id, employee_id, salary, job_location, job_cat, job_info) values(1, 1, 100, 'Buona Vista', 'Pat me to sleep', 'I just broke up with my girlfriend and finding it hard to fall asleep. My girlfriend used to pat me to sleep each night and now that shes gone, i have no one to pat me to sleep thus, no sweet dreams for me. Pat me!');

-- update jobs set job_cat = 'Backflips' where job_id=6;