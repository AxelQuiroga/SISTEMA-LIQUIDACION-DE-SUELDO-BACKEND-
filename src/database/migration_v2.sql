-- MIGRACIÓN V2 - Sistema de Recibos de Sueldo

-- 1. Actualizamos Conceptos
ALTER TABLE payroll_concepts ALTER COLUMN type DROP NOT NULL;
ALTER TABLE payroll_concepts DROP CONSTRAINT IF EXISTS payroll_concepts_type_check;
ALTER TABLE payroll_concepts ADD COLUMN IF NOT EXISTS code VARCHAR(20) UNIQUE;
ALTER TABLE payroll_concepts ADD COLUMN IF NOT EXISTS category VARCHAR(20);
ALTER TABLE payroll_concepts ADD COLUMN IF NOT EXISTS is_percentage BOOLEAN DEFAULT false;
ALTER TABLE payroll_concepts ADD COLUMN IF NOT EXISTS base_value NUMERIC(5,2);
ALTER TABLE payroll_concepts ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Mapeo inicial para no perder lo que ya existe
UPDATE payroll_concepts SET category = 'remunerative' WHERE category IS NULL;
ALTER TABLE payroll_concepts ALTER COLUMN category SET NOT NULL;
ALTER TABLE payroll_concepts ADD CONSTRAINT payroll_concepts_category_check CHECK (category IN ('remunerative', 'non_remunerative', 'deduction'));

-- 2. Actualizamos Payrolls (Cabecera)
ALTER TABLE payrolls ADD COLUMN IF NOT EXISTS total_non_remunerative NUMERIC(12,2) DEFAULT 0;
ALTER TABLE payrolls ADD COLUMN IF NOT EXISTS total_deductions NUMERIC(12,2) DEFAULT 0;

-- Si existía la columna deductions, pasamos los datos y la borramos
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payrolls' AND column_name='deductions') THEN
        UPDATE payrolls SET total_deductions = deductions;
        ALTER TABLE payrolls DROP COLUMN deductions;
    END IF;
END $$;

-- 3. Actualizamos Items (Detalle)
ALTER TABLE payroll_items ADD COLUMN IF NOT EXISTS base_amount NUMERIC(10,2);
ALTER TABLE payroll_items DROP CONSTRAINT IF EXISTS payroll_items_payroll_id_fkey;
ALTER TABLE payroll_items ADD CONSTRAINT payroll_items_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES payrolls(id) ON DELETE CASCADE;

-- 4. Limpiamos y recargamos conceptos básicos para que el motor funcione
-- (Esto asegura que BAS, ANT, JUB, etc existan con sus códigos)
TRUNCATE TABLE payroll_items CASCADE;
DELETE FROM payroll_concepts;

INSERT INTO payroll_concepts (name, code, category, is_percentage, base_value) VALUES
('Sueldo Básico', 'BAS', 'remunerative', false, NULL),
('Antigüedad', 'ANT', 'remunerative', true, 1.00),
('Presentismo', 'PRE', 'remunerative', true, 8.33),
('Horas Extra 50%', 'HE50', 'remunerative', false, NULL),
('Jubilación (SIPA 11%)', 'JUB', 'deduction', true, 11.00),
('Obra Social (3%)', 'OS', 'deduction', true, 3.00),
('Ley 19.032 (3%)', 'LEY', 'deduction', true, 3.00),
('Sindicato (2%)', 'SIND', 'deduction', true, 2.00),
('Viáticos (No Rem.)', 'VIA', 'non_remunerative', false, NULL);
