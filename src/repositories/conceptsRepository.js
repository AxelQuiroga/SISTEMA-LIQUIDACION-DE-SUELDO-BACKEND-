import pool from '../config/db.js';

export const getAllConcepts = async () => {
  const { rows } = await pool.query(
    'SELECT * FROM payroll_concepts WHERE active = true ORDER BY category, id'
  );
  return rows;
};

export const getConceptByCode = async (code) => {
  const { rows } = await pool.query(
    'SELECT * FROM payroll_concepts WHERE code = $1 AND active = true',
    [code]
  );
  return rows[0];
};

export const getConceptsByCategory = async (category) => {
  const { rows } = await pool.query(
    'SELECT * FROM payroll_concepts WHERE category = $1 AND active = true',
    [category]
  );
  return rows;
};
