import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: {
    message: "Demasiados intentos de login. Intenta nuevamente en 15 minutos."
  },
  standardHeaders: true,
  legacyHeaders: false
});