import { Router } from 'express';
import * as payrollController from '../controllers/payroll.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

//employee watch his payroll
router.get(
  '/me',
  authenticate,
  authorize('user'),
  payrollController.getMyPayrolls
);

// GET todos los recibos → admin y contable
router.get('/', authenticate, authorize('admin', 'accountant','superadmin'), payrollController.getAllPayrolls);

// GET recibos por empleado → admin, contable
router.get('/employee/:employee_id', authenticate, authorize('admin', 'accountant','superadmin'), payrollController.getPayrollsByEmployee);



// GET recibo por ID  admin, contable
router.get('/:id', authenticate, authorize('admin', 'accountant','superadmin'), payrollController.getPayrollById);

// POST crear recibo  admin, contable
router.post('/', authenticate, authorize('admin', 'accountant','superadmin'), payrollController.createPayroll);

// PUT actualizar recibo  admin, contable
router.put('/:id', authenticate, authorize('admin', 'accountant','superadmin'), payrollController.updatePayroll);

// DELETE recibo solo admins
router.delete('/:id', authenticate, authorize('admin','superadmin'), payrollController.deletePayroll);

export default router;