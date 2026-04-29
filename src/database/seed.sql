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