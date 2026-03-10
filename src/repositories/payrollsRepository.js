import pool from "../config/db.js";

export const getAllPayrolls = async () => {
  const { rows } = await pool.query(
    `SELECT id, employee_id, period, gross_salary, deductions, net_salary, created_by, created_at
     FROM payrolls
     ORDER BY id`,
  );
  return rows;
};

export const getPayrollById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, employee_id, period, gross_salary, deductions, net_salary, created_by, created_at
    FROM payrolls WHERE id=$1`,
    [id],
  );
  return rows[0];
};

export const getPayrollsByEmployee = async (employee_id) => {
  const { rows } = await pool.query(
    `SELECT id, employee_id, period, gross_salary, deductions, net_salary, created_by, created_at
      FROM payrolls WHERE employee_id=$1
      ORDER BY period`,
    [employee_id],
  );
  return rows;
};

export const createPayroll = async ({
  employee_id,
  period,
  gross_salary,
  deductions,
  net_salary,
  created_by,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO payrolls
            (employee_id,period,gross_salary
    ,deductions,net_salary,created_by,created_at)
    VALUES ($1,$2,$3,$4,$5,$6,NOW())
    RETURNING id, employee_id, period, gross_salary, deductions, net_salary, created_by, created_at`,
    [employee_id, period, gross_salary, deductions, net_salary, created_by],
  );
  return rows[0];
};

export const updatePayroll = async (
  id,
  { period, gross_salary, deductions, net_salary },
) => {
  const { rows } = await pool.query(
    `UPDATE payrolls
     SET period=$1,
         gross_salary=$2,
         deductions=$3,
         net_salary=$4
     WHERE id=$5
     RETURNING id, employee_id, period, gross_salary, deductions, net_salary, created_by, created_at`,
    [period, gross_salary, deductions, net_salary, id],
  );

  return rows[0];
};
export const deletePayroll = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM payrolls 
    WHERE id=$1
    RETURNING id, employee_id, period, gross_salary, deductions, net_salary, created_by, created_at`,
    [id],
  );
  return rows[0];
};

//Trae info del recibo y del empleado asociado en un solo query.
export const getPayrollWithEmployeeInfo = async () => {
  const { rows } = await pool.query(
    `SELECT p.id, p.period, p.gross_salary, p.deductions, p.net_salary,
            e.first_name, e.last_name, e.position
     FROM payrolls p
     JOIN employees e ON p.employee_id = e.id
     ORDER BY p.period DESC`,
  );
  return rows;
};
//employee watch his payroll
export const getPayrollsByUserId = async (userId) => {
  const { rows } = await pool.query(
    `
    SELECT p.id, p.employee_id, p.period, p.gross_salary, p.deductions, p.net_salary, p.created_at
    FROM payrolls p
    JOIN employees e ON p.employee_id = e.id
    WHERE e.user_id = $1
    ORDER BY p.period DESC
    `,
    [userId],
  );

  return rows;
};
//escalable porque: agregar más columnas o relaciones no rompe la app.

//reutilizable porque: services o controllers solo llaman a estas funciones.
