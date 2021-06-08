import pg from 'pg';
 const { Pool } = pg;

// DB Configuration
const pgConnectionConfig = {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    };


const pool = new Pool(pgConnectionConfig);

export default pool;
