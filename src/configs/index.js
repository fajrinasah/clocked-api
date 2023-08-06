import dotenv from "dotenv";

dotenv.config();

// create db configuration
const db_config = Object.freeze({
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
});

/*--------------------------------------------------------
// ENVIRONMENT VARIABLES
---------------------------------------------------------*/
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const OTP_SECRET_KEY = process.env.OTP_SECRET_KEY;
export const ENCRYPTION_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;

export const GMAIL = process.env.GMAIL;
export const GMAIL_APP_KEY = process.env.GMAIL_APP_KEY;

export default db_config[process.env.NODE_ENV || "development"];
