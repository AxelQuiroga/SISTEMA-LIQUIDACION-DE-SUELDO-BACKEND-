export const calculateNetSalary = ({ gross_salary, deductions = 0, bonuses = 0, extra_hours = 0 }) => {
  // 1. Sumar bonos y horas extra al bruto
  const totalIncome = gross_salary + bonuses + extra_hours;

  // 2. Restar deducciones
  const net_salary = totalIncome - deductions;

  // 3. Asegurar que el net_salary nunca sea negativo
  return net_salary >= 0 ? net_salary : 0;
};