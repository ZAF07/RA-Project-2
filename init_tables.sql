CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  email TEXT,
  password TEXT
);

CREATE TABLE IF NOT EXISTS jobs (
  job_id SERIAL PRIMARY KEY,
  employer_id INT,
  employee_id INT,
  salary INT,
  job_location TEXT,
  job_cat TEXT,
  job_info TEXT,
  date DATE
);

insert into jobs (employer_id, employee_id, salary, job_location, job_cat, job_info) values(1, 1, 20, 'Tampines Central', 'Send', 'I need a parcel delivered by tonight 9pm please. Any help would be good!');