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
    type VARCHAR(20) NOT NULL,

    CONSTRAINT payroll_concepts_type_check
    CHECK (type IN ('earning','deduction'))
);



-- PAYROLLS
CREATE TABLE payrolls (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    period VARCHAR(7) NOT NULL,
    gross_salary NUMERIC(12,2) NOT NULL,
    deductions NUMERIC(12,2) NOT NULL,
    net_salary NUMERIC(12,2) NOT NULL,
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

    CONSTRAINT payroll_items_payroll_id_fkey
    FOREIGN KEY (payroll_id)
    REFERENCES payrolls(id),

    CONSTRAINT payroll_items_concept_id_fkey
    FOREIGN KEY (concept_id)
    REFERENCES payroll_concepts(id)
);