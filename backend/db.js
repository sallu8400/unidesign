// import sql from "mssql";
// import dotenv from 'dotenv'
// dotenv.config()

// export const sqlInstance = sql;

// export const config = {
//  user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   options: { encrypt: false, trustServerCertificate: true }
// };


import sql from "mssql";
import dotenv from 'dotenv'
dotenv.config()

export const sqlInstance = sql;

export const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  

  port: parseInt(process.env.DB_PORT), 

  options: { 
    encrypt: false, 
    trustServerCertificate: true 
  }
};
