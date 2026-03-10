import * as authService from '../services/authService.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (err) {
    next(err); // pasa al error middleware
  }
};

// registro opcional seguro
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body; // ignoramos role que venga del body
    const safeUser = await authService.register({ email, password }); // ya es DTO seguro

    res.status(201).json(safeUser);
  } catch (err) {
    next(err);
  }
};

//crear admin
export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await authService.createAdmin({ email, password });

    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//crear accountant
export const createAccountant = async (req,res) => {
  try {
    const {email,password} = req.body;
    
    const accountant = await authService.createAccountant({email,password})

    res.status(201).json(accountant)
  } catch (error) {
    res.status(400).json({message: error.message})
  }
}