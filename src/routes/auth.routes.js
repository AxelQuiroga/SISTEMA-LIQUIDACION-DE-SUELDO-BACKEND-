import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Login genera token
router.post('/login', loginLimiter,authController.login);

// Registro  crea usuario nuevo
router.post('/register', authController.register);

//crear admin
router.post(
  '/create-admin',
  authenticate,
  authorize('superadmin'),
  authController.createAdmin
);

//accountant
router.post('/create-accountant',authenticate,authorize('superadmin','admin'),authController.createAccountant)

export default router;