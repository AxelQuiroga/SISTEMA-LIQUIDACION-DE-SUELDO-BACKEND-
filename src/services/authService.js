import * as authRepo from '../repositories/authRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const login = async (email, password) => {
  const user = await authRepo.getUserByEmail(email);
  const validPassword = user
    ? await bcrypt.compare(password, user.password_hash)
    : false;

  if (!user || !validPassword) {
    await delay(500);
    throw new Error('Credenciales inválidas');
  }
  // generar token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, user: { id: user.id, email: user.email, role: user.role } };
};

// registro opcional
export const register = async ({ email, password }) => {
  const existing = await authRepo.getUserByEmail(email);
  if (existing) throw new Error('Usuario ya existe');

  const password_hash = await bcrypt.hash(password, 10); // 10 salt rounds
  const newUser = await authRepo.createUser({ email, password_hash});
  
// mapear a DTO seguro
const safeUser = {
  id: newUser.id,
  email: newUser.email,
  role: newUser.role,
  created_at: newUser.created_at
};

return safeUser;
};

//para crear admin 
export const createAdmin = async ({ email, password }) => {
  const existing = await authRepo.getUserByEmail(email);
  if (existing) throw new Error('Usuario ya existe');

  const password_hash = await bcrypt.hash(password, 10);

  const newAdmin = await authRepo.createAdminUser({
    email,
    password_hash
  });

  return newAdmin;
};

//crear accountant
export const createAccountant = async({email,password}) => {
  const existing = await authRepo.getUserByEmail(email)
  if (existing) throw new Error('Usuario ya existe')

  const password_hash = await bcrypt.hash(password,10)

  const newAccountant = await authRepo.createAccountant({
    email,password_hash
  })
  return newAccountant
}