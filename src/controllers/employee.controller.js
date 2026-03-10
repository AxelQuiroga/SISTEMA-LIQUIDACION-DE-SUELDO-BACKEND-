import * as employeeService from '../services/employeeService.js';

export const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    next(error); // pasa al error middleware
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);
    res.status(200).json(employee);
  } catch (error) {
    next(error); // por ejemplo: empleado no encontrado
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const data = req.body;
    const newEmployee = await employeeService.createEmployee(data);
    res.status(201).json(newEmployee);
  } catch (error) {
    next(error); // maneja errores de validación o DB
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedEmployee = await employeeService.updateEmployee(id, data);
    res.status(200).json(updatedEmployee);
  } catch (error) {
    next(error); // empleado no encontrado o validaciones
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await employeeService.deleteEmployee(id);
    res.status(200).json({ message: 'Empleado eliminado', employee: deletedEmployee });
  } catch (error) {
    next(error); // empleado no encontrado
  }
};

