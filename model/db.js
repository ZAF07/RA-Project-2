import pg from 'pg';
 const { Pool } = pg;
let pgConnectionConfig;

// DB Configuration


if (process.env.DATABASE_URL) {
  pgConnectionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else {
   
     pgConnectionConfig = {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    };
}


const pool = new Pool(pgConnectionConfig);

export default pool;
