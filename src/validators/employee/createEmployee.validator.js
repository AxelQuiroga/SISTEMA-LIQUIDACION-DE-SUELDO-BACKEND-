import { body } from "express-validator";

export const createEmployeeValidator = [
    body("user_id")
    .notEmpty().withMessage("El campo user_id es obligatorio")
    .isInt().withMessage("El campo user_id debe ser un número entero"),

    body("first_name")
    .notEmpty().withMessage("Nombre es obligatorio")
    .isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres")
    .trim(),

    body("dni")
    .notEmpty().withMessage("El campo dni es obligatorio")
    .isNumeric().withMessage("El campo dni debe ser un número"),

    body("hire_date")
    .notEmpty().withMessage("Fecha de ingreso obligatoria")
    .isISO8601().withMessage("Formato de fecha inválido"),

  body("position")
    .notEmpty().withMessage("Posición obligatoria")
    .trim(),

  body("base_salary")
    .notEmpty().withMessage("Salario base obligatorio")
    .isNumeric().withMessage("Debe ser número")
    .custom(v => v > 0).withMessage("Debe ser mayor a 0"),

]