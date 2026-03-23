import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createEmployeeValidator } from '../validators/employee/createEmployee.validator.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

// Todas estas rutas solo admin
router.get('/', authenticate, authorize('admin','superadmin','accountant'), employeeController.getAllEmployees);

router.get('/:id', authenticate, authorize('admin','superadmin','accountant'), employeeController.getEmployeeById);

router.post('/', authenticate, authorize('admin','superadmin'),createEmployeeValidator,validate, employeeController.createEmployee);

router.put('/:id', authenticate, authorize('admin','superadmin'), employeeController.updateEmployee);

router.delete('/:id', authenticate, authorize('admin','superadmin'), employeeController.deleteEmployee);

export default router;