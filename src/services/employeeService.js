import * as employeeRepo from '../repositories/employeesRepository.js';

export const getAllEmployees = async () => {
  const employees = await employeeRepo.getAllEmployees();
  return employees;
};

export const getEmployeeById = async (id) => {
  const employee = await employeeRepo.getEmployeeById(id);
  if (!employee) throw new Error('Empleado no encontrado');
  return employee;
};

export const createEmployee = async (data) => {
  // 1. Validación básica (podemos agregar más reglas luego)
  if (!data.first_name || !data.last_name || !data.dni || !data.hire_date || !data.position || !data.base_salary) {
    throw new Error('Todos los campos obligatorios deben ser completados');
  }

  // 2. Crear el empleado usando repository
  const newEmployee = await employeeRepo.createEmployee(data);

  return newEmployee;
};

export const updateEmployee = async (id, data) => {

  const existing = await employeeRepo.getEmployeeById(id);
  if (!existing) throw new Error("Empleado no encontrado");

  const updated = await employeeRepo.updateEmployee(id, {
    user_id: data.user_id ?? existing.user_id,
    first_name: data.first_name ?? existing.first_name,
    last_name: data.last_name ?? existing.last_name,
    dni: data.dni ?? existing.dni,
    hire_date: data.hire_date ?? existing.hire_date,
    position: data.position ?? existing.position,
    base_salary: data.base_salary ?? existing.base_salary,
    active: data.active ?? existing.active
  });

  return updated;
};

export const deleteEmployee = async (id) => {
  const existing = await employeeRepo.getEmployeeById(id);
  if (!existing) throw new Error('Empleado no encontrado');

  const deletedEmployee = await employeeRepo.deleteEmployee(id);
  return deletedEmployee;
};