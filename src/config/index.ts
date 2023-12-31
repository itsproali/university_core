import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development" ? true : false,
  PORT: process.env.PORT || 5000,
  DB_URI: process.env.DB_URI || "mongodb://localhost:27017/university",
  DB_URI_PROD: process.env.DB_URI_PROD as string,
  DEFAULT_STUDENT_PASS: process.env.DEFAULT_STUDENT_PASS || "student123",
  DEFAULT_FACULTY_PASS: process.env.DEFAULT_FACULTY_PASS || "faculty123",
  DEFAULT_ADMIN_PASS: process.env.DEFAULT_ADMIN_PASS || "admin123",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh-secret",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};
