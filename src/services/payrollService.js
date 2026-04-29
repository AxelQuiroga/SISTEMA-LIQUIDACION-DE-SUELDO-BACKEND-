import * as payrollRepo from '../repositories/payrollsRepository.js';
import * as employeeRepo from '../repositories/employeesRepository.js';
import * as payrollItemRepo from "../repositories/payrollItemRepository.js";
import * as conceptRepo from "../repositories/conceptsRepository.js";
import { calculatePayroll } from '../utils/calculateNetSalary.js';

export const createPayroll = async (data) => {
  try {
    // 1. Obtener datos del empleado
    const employee = await employeeRepo.getEmployeeById(data.employee_id);
    if (!employee) throw new Error('Empleado no encontrado');

    // 2. Calcular antigüedad (años)
    const hireDate = new Date(employee.hire_date);
    const today = new Date();
    let seniorityYears = today.getFullYear() - hireDate.getFullYear();
    const monthDiff = today.getMonth() - hireDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < hireDate.getDate())) {
      seniorityYears--;
    }
    employee.seniority_years = seniorityYears < 0 ? 0 : seniorityYears;

    // 3. Obtener todos los conceptos activos de la DB
    const concepts = await conceptRepo.getAllConcepts();

    // 4. EJECUTAR MOTOR DE CÁLCULO
    const calculation = calculatePayroll(employee, concepts, data.news || {});

    // 5. Guardar cabecera del recibo
    const newPayroll = await payrollRepo.createPayroll({
      employee_id: data.employee_id,
      period: data.period,
      gross_salary: calculation.totals.gross_salary,
      total_non_remunerative: calculation.totals.total_non_remunerative,
      total_deductions: calculation.totals.total_deductions,
      net_salary: calculation.totals.net_salary,
      created_by: data.created_by
    });

    // 6. Guardar el detalle (ítems)
    const itemPromises = calculation.items.map(item => 
      payrollItemRepo.createPayrollItem({
        payroll_id: newPayroll.id,
        concept_id: item.concept_id,
        amount: item.amount,
        base_amount: item.base_amount || null
      })
    );

    await Promise.all(itemPromises);

    return {
      ...newPayroll,
      items: calculation.items
    };

  } catch (error) {
    if (error.code === '23505') {
      throw new Error('Ya existe una liquidación para este empleado en ese período');
    }
    throw error;
  }
};

export const updatePayroll = async (id, data) => {
  const existing = await payrollRepo.getPayrollById(id);
  if (!existing) throw new Error('Recibo no encontrado');

  const employee = await employeeRepo.getEmployeeById(existing.employee_id);
  
  // Calcular antigüedad de nuevo por si cambió de un mes a otro
  const hireDate = new Date(employee.hire_date);
  const today = new Date();
  let seniorityYears = today.getFullYear() - hireDate.getFullYear();
  const monthDiff = today.getMonth() - hireDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < hireDate.getDate())) {
    seniorityYears--;
  }
  employee.seniority_years = seniorityYears < 0 ? 0 : seniorityYears;

  const concepts = await conceptRepo.getAllConcepts();
  
  // Si no mandan news nuevas, podríamos intentar reconstruirlas o dejar las que están. 
  // Por ahora, asumimos que mandan el objeto completo de novedades si quieren actualizar.
  const calculation = calculatePayroll(employee, concepts, data.news || {});

  const updated = await payrollRepo.updatePayroll(id, {
    period: data.period ?? existing.period,
    gross_salary: calculation.totals.gross_salary,
    total_non_remunerative: calculation.totals.total_non_remunerative,
    total_deductions: calculation.totals.total_deductions,
    net_salary: calculation.totals.net_salary
  });

  // Sincronizar ítems (borramos y volvemos a crear para simplificar)
  await payrollItemRepo.deletePayrollItemsByPayroll(id);

  const itemPromises = calculation.items.map(item => 
    payrollItemRepo.createPayrollItem({
      payroll_id: id,
      concept_id: item.concept_id,
      amount: item.amount,
      base_amount: item.base_amount || null
    })
  );

  await Promise.all(itemPromises);

  return {
    ...updated,
    items: calculation.items
  };
};

//lecturaa
export const getPayrolls = async () => {
  return await payrollRepo.getPayrollWithEmployeeInfo();
};

export const getPayrollById = async (id) => {
  const payroll = await payrollRepo.getPayrollById(id);
  if (!payroll) throw new Error('Recibo no encontrado');
  return payroll;
};

export const getPayrollsByEmployee = async (employee_id) => {
  const employee = await employeeRepo.getEmployeeById(employee_id);
  if (!employee) throw new Error('Empleado no encontrado');
  return await payrollRepo.getPayrollsByEmployee(employee_id);
};


//eliminar
export const deletePayroll = async (id) => {
  const payroll = await payrollRepo.getPayrollById(id);
  if (!payroll) throw new Error('Recibo no encontrado');

  return await payrollRepo.deletePayroll(id);
};

//employee watch his id
export const getMyPayrolls = async (userId) => {
  return await payrollRepo.getPayrollsByUserId(userId);
};