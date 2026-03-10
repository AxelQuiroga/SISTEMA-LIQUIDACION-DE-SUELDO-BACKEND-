// src/services/payrollService.js
import * as payrollRepo from '../repositories/payrollsRepository.js';
import * as employeeRepo from '../repositories/employeesRepository.js';
import * as payrollItemRepo from "../repositories/payrollItemRepository.js";
import { calculateNetSalary } from '../utils/calculateNetSalary.js';

export const createPayroll = async (data) => {
  try {

    const employee = await employeeRepo.getEmployeeById(data.employee_id);
    if (!employee) throw new Error('Empleado no encontrado');

    const net_salary = calculateNetSalary({
      gross_salary: data.gross_salary,
      deductions: data.deductions,
      bonuses: data.bonuses || 0,
      extra_hours: data.extra_hours || 0
    });

    const newPayroll = await payrollRepo.createPayroll({
      employee_id: data.employee_id,
      period: data.period,
      gross_salary: data.gross_salary,
      deductions: data.deductions,
      net_salary,
      created_by: data.created_by
    });

    await payrollItemRepo.createPayrollItem({
      payroll_id: newPayroll.id,
      concept_id: 1,
      amount: data.gross_salary
    });

    if (data.extra_hours) {
      await payrollItemRepo.createPayrollItem({
        payroll_id: newPayroll.id,
        concept_id: 2,
        amount: data.extra_hours
      });
    }

    if (data.bonuses) {
      await payrollItemRepo.createPayrollItem({
        payroll_id: newPayroll.id,
        concept_id: 3,
        amount: data.bonuses
      });
    }

    await payrollItemRepo.createPayrollItem({
      payroll_id: newPayroll.id,
      concept_id: 4,
      amount: data.deductions
    });

    return newPayroll;

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

  const gross_salary = data.gross_salary ?? existing.gross_salary;
  const deductions = data.deductions ?? existing.deductions;
  const bonuses = data.bonuses ?? 0;
  const extra_hours = data.extra_hours ?? 0;

  const net_salary = calculateNetSalary({
    gross_salary,
    deductions,
    bonuses,
    extra_hours
  });

  const updated = await payrollRepo.updatePayroll(id, {
    period: data.period ?? existing.period,
    gross_salary,
    deductions,
    net_salary
  });

  // sincronizar items
  await payrollItemRepo.deletePayrollItemsByPayroll(id);

  await payrollItemRepo.createPayrollItem({
    payroll_id: id,
    concept_id: 1,
    amount: gross_salary
  });

  if (extra_hours) {
    await payrollItemRepo.createPayrollItem({
      payroll_id: id,
      concept_id: 2,
      amount: extra_hours
    });
  }

  if (bonuses) {
    await payrollItemRepo.createPayrollItem({
      payroll_id: id,
      concept_id: 3,
      amount: bonuses
    });
  }

  await payrollItemRepo.createPayrollItem({
    payroll_id: id,
    concept_id: 4,
    amount: deductions
  });

  return updated;
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