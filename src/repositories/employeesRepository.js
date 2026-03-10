import pool from "../config/db.js";

export const getAllEmployees = async () => {
  const { rows } = await pool.query(`SELECT * FROM employees
    WHERE active = true
    ORDER BY id`);
  return rows;
};

export const getEmployeeById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM employees WHERE id = $1", [
    id,
  ]);
  return rows[0];
};

export const createEmployee = async ({
  user_id,
  first_name,
  last_name,
  dni,
  hire_date,
  position,
  base_salary,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO employees
    (user_id, first_name, last_name, dni, hire_date, position, base_salary, active, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW())
    RETURNING *`,
    [user_id, first_name, last_name, dni, hire_date, position, base_salary],
  );

  return rows[0];
};

export const updateEmployee = async (
  id,
  {
    user_id,
    first_name,
    last_name,
    dni,
    hire_date,
    position,
    base_salary,
    active,
  },
) => {
  const { rows } = await pool.query(
    `UPDATE employees
     SET user_id=$1,
         first_name=$2,
         last_name=$3,
         dni=$4,
         hire_date=$5,
         position=$6,
         base_salary=$7,
         active=$8
     WHERE id=$9
     RETURNING *`,
    [
      user_id,
      first_name,
      last_name,
      dni,
      hire_date,
      position,
      base_salary,
      active,
      id,
    ],
  );
  return rows[0];
};

export const deleteEmployee = async (id) => {
  const { rows } = await pool.query(
    `UPDATE employees
     SET active = false
     WHERE id = $1
     RETURNING *`,
    [id],
  );

  return rows[0];
};
