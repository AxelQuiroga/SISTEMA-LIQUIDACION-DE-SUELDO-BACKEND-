import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './src/routes/auth.routes.js';
import employeeRoutes from './src/routes/employee.routes.js';
import payrollRoutes from './src/routes/payroll.routes.js';

import { errorHandler } from './src/middlewares/error.middleware.js';


dotenv.config();

const app = express();

// Middleware global para parsear JSON
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use('/payrolls', payrollRoutes);

// Middleware global de manejo de errores (siempre al final)
app.use(errorHandler);

export default app;
