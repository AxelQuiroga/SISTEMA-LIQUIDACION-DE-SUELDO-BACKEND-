# Sistema Recibo de Sueldo - Backend

API REST para gestionar empleados, recibos de sueldo y usuarios con roles.

## Stack
- Node.js + Express
- PostgreSQL (`pg`)
- Auth JWT (`jsonwebtoken`)
- Hashing (`bcrypt`)
- Seguridad (`helmet`, `express-rate-limit`)
- CORS (`cors`)

## Requisitos
- Node.js instalado
- PostgreSQL activo
- Base de datos creada y esquema aplicado
- Seed de conceptos cargado

Archivos SQL:
- `src/database/schema.sql`
- `src/database/seed.sql`

## Configuración
Variables en `.env` :
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_NAME`
- `DB_PORT`
- `JWT_SECRET`
- `FRONTEND_URL`

## Ejecutar
```bash
npm install
npm start

Rutas
Auth
Método	Ruta	Auth	Rol
POST	/auth/login	No	-
POST	/auth/register	No	-
POST	/auth/create-admin	Sí	superadmin
POST	/auth/create-accountant	Sí	superadmin, admin
Employees
Método	Ruta	Auth	Rol
GET	/employees	Sí	admin, superadmin, accountant
GET	/employees/:id	Sí	admin, superadmin, accountant
POST	/employees	Sí	admin, superadmin
PUT	/employees/:id	Sí	admin, superadmin
DELETE	/employees/:id	Sí	admin, superadmin
Payrolls
Método	Ruta	Auth	Rol
GET	/payrolls	Sí	admin, superadmin, accountant
GET	/payrolls/:id	Sí	admin, superadmin, accountant
GET	/payrolls/employee/:employee_id	Sí	admin, superadmin, accountant
GET	/payrolls/me	Sí	user
POST	/payrolls	Sí	admin, superadmin, accountant
PUT	/payrolls/:id	Sí	admin, superadmin, accountant
DELETE	/payrolls/:id	Sí	admin, superadmin
Autenticación
Header requerido:

Authorization: Bearer <token>
Token expira en 1h.

Login tiene rate limit: 5 intentos por 15 minutos.

Modelo de Datos (schema.sql)
users:

id, email, password_hash, role, created_at
employees:

id, first_name, last_name, dni, hire_date, position, base_salary, active, created_at, user_id
payrolls:

id, employee_id, period, gross_salary, deductions, net_salary, created_by, created_at
payroll_concepts:

id, name, type
payroll_items:

id, payroll_id, concept_id, amount
Lógica de sueldos
net_salary = max(0, gross_salary + bonuses + extra_hours - deductions)

Seed requerido
seed.sql crea los conceptos usados al generar items:

1: Sueldo Básico
2: Horas Extra
3: Bono
4: Jubilación (deducción)
Scripts
npm start
npm run test-script
test-script usa servicios directamente y necesita:

usuarios existentes en users
conceptos cargados desde seed.sql
Estructura del Proyecto
back/
  app.js
  server.js
  src/
    config/
    controllers/
    database/
    middlewares/
    repositories/
    routes/
    services/
    utils/
