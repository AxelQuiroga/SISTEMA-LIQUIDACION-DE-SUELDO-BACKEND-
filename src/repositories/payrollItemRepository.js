import pool from "../config/db.js";

export const createPayrollItem = async ({ payroll_id, concept_id, amount, base_amount }) => {
  const query = `
    INSERT INTO payroll_items (payroll_id, concept_id, amount, base_amount)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [payroll_id, concept_id, amount, base_amount];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getPayrollItemsByPayroll = async (payroll_id) => {
  const query = `
    SELECT 
      pi.id,
      pi.amount,
      pi.base_amount,
      pc.name,
      pc.category,
      pc.code
    FROM payroll_items pi
    JOIN payroll_concepts pc 
      ON pi.concept_id = pc.id
    WHERE pi.payroll_id = $1
  `;

  const { rows } = await pool.query(query, [payroll_id]);
  return rows;
};

export const deletePayrollItemsByPayroll = async (payroll_id) => {
  const query = `
    DELETE FROM payroll_items
    WHERE payroll_id = $1
  `;

  await pool.query(query, [payroll_id]);
};