import pg from 'pg';
// DB Configuration
const { Pool } = pg;
const pgConnectionConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

const pool = new Pool(pgConnectionConfig);

export default pool;
