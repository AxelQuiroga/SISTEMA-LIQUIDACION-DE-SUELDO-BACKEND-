import * as payrollService from '../services/payrollService.js';

export const getAllPayrolls = async (req, res, next) => {
  try {
    const payrolls = await payrollService.getPayrolls();
    res.status(200).json(payrolls);
  } catch (error) {
    next(error);
  }
};

export const getPayrollById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payroll = await payrollService.getPayrollById(id);
    res.status(200).json(payroll);
  } catch (error) {
    next(error);
  }
};

export const getPayrollsByEmployee = async (req, res, next) => {
  try {
    const { employee_id } = req.params;
    const payrolls = await payrollService.getPayrollsByEmployee(employee_id);
    res.status(200).json(payrolls);
  } catch (error) {
    next(error);
  }
};

export const createPayroll = async (req, res, next) => {
  try {
    const data = {...req.body,created_by: req.user.id};
    const newPayroll = await payrollService.createPayroll(data);
    res.status(201).json(newPayroll);
  } catch (error) {
    next(error);
  }
};

export const updatePayroll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedPayroll = await payrollService.updatePayroll(id, data);
    res.status(200).json(updatedPayroll);
  } catch (error) {
    next(error);
  }
};

export const deletePayroll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPayroll = await payrollService.deletePayroll(id);
    res.status(200).json({ message: 'Recibo eliminado', payroll: deletedPayroll });
  } catch (error) {
    next(error);
  }
};

//emplooyee watch his payroll
export const getMyPayrolls = async (req, res,next) => {
  try {
    const userId = req.user.id;

    const payrolls = await payrollService.getMyPayrolls(userId);

    res.json(payrolls);
  } catch (error) {
    next(error);
  }
};
