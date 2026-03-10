// src/config/db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,       // usuario de la DB
  host: process.env.DB_HOST,       // localhost o IP del servidor
  database: process.env.DB_NAME,   // nombre de la DB
  password: process.env.DB_PASSWORD, // contraseña
  port: process.env.DB_PORT || 5432, // puerto
});

export default pool;