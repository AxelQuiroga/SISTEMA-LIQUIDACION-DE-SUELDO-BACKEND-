import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  //error corta todo

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //errores en array
  }

  next();
};
