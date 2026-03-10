import pool from '../config/db.js';

// Buscar usuario por email (para login)
export const getUserByEmail = async (email) => {
  const { rows } = await pool.query(
    `SELECT id, email, password_hash, role
    FROM users WHERE email=$1`,
    [email]
  );
  return rows[0]; // devuelve undefined si no existe
};

// Crear usuario nuevo (opcional, si queremos endpoint de registro)
export const createUser = async ({ email, password_hash}) => {
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, created_at)
     VALUES ($1,$2,NOW())
     RETURNING id,email,role,created_at`,
    [email, password_hash]
  );
  return rows[0];
};

//crear admin  user
export const createAdminUser = async ({ email, password_hash }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, role, created_at)
     VALUES ($1, $2, 'admin', NOW())
     RETURNING id,email,role,created_at`,
    [email, password_hash]
  );

  return rows[0];
};

//crear accountant
export const createAccountant = async ({email,password_hash}) =>{
  const { rows } = await pool.query( `INSERT INTO users (email, password_hash, role, created_at)
     VALUES ($1, $2, 'accountant', NOW())
     RETURNING id,email,role,created_at`,
    [email,password_hash]
  );

  return rows[0]   
}