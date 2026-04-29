-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
    CHECK (role IN ('user','admin','superadmin','accountant'))--agregamos accountant
);



-- EMPLOYEES
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    hire_date DATE NOT NULL,
    position VARCHAR(100) NOT NULL,
    base_salary NUMERIC(12,2) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,

    CONSTRAINT fk_employee_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);



-- índice parcial 
CREATE UNIQUE INDEX employees_unique_active_user
ON employees(user_id)
WHERE active = true;



-- PAYROLL_CONCEPTS
CREATE TABLE payroll_concepts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE, -- Ej: 'BAS', 'JUB', 'OS'
    category VARCHAR(20) NOT NULL, -- 'remunerative', 'non_remunerative', 'deduction'
    is_percentage BOOLEAN DEFAULT false,
    base_value NUMERIC(5,2), -- El valor del % (ej: 11.00)
    active BOOLEAN DEFAULT true,

    CONSTRAINT payroll_concepts_category_check
    CHECK (category IN ('remunerative', 'non_remunerative', 'deduction'))
);



-- PAYROLLS
CREATE TABLE payrolls (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    period VARCHAR(7) NOT NULL,
    gross_salary NUMERIC(12,2) NOT NULL, -- Total Remunerativo
    total_non_remunerative NUMERIC(12,2) DEFAULT 0,
    total_deductions NUMERIC(12,2) DEFAULT 0, -- Suma de todas las retenciones
    net_salary NUMERIC(12,2) NOT NULL, -- El "en mano"
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee
    FOREIGN KEY (employee_id)
    REFERENCES employees(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_user
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE RESTRICT,

    CONSTRAINT unique_employee_period
    UNIQUE(employee_id, period)
);



-- PAYROLL_ITEMS
CREATE TABLE payroll_items (
    id SERIAL PRIMARY KEY,
    payroll_id INTEGER,
    concept_id INTEGER,
    amount NUMERIC(10,2) NOT NULL,
    base_amount NUMERIC(10,2), -- Sobre qué se calculó (ej: el bruto)

    CONSTRAINT payroll_items_payroll_id_fkey
    FOREIGN KEY (payroll_id)
    REFERENCES payrolls(id)
    ON DELETE CASCADE,

    CONSTRAINT payroll_items_concept_id_fkey
    FOREIGN KEY (concept_id)
    REFERENCES payroll_concepts(id)
);