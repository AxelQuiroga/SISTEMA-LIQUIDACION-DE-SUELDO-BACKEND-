/**
 * Motor de cálculo de sueldo para Argentina
 * @param {Object} employeeInfo - Datos del empleado (básico, fecha de ingreso)
 * @param {Array} concepts - Lista de conceptos desde la DB con sus fórmulas
 * @param {Object} news - Novedades del mes (horas extra, inasistencias, bonos)
 */
export const calculatePayroll = (employeeInfo, concepts, news = {}) => {
  const { base_salary } = employeeInfo;
  const items = [];
  
  // 1. CONCEPTOS REMUNERATIVOS (Suman al bruto)
  let totalRemunerative = 0;

  // Básico
  const basicConcept = concepts.find(c => c.code === 'BAS');
  if (basicConcept) {
    const amount = Number(base_salary);
    totalRemunerative += amount;
    items.push({ concept_id: basicConcept.id, code: 'BAS', name: basicConcept.name, amount, category: 'remunerative' });
  }

  // Antigüedad (Ej: 1% por año)
  const antConcept = concepts.find(c => c.code === 'ANT');
  if (antConcept && employeeInfo.seniority_years > 0) {
    const percentage = Number(antConcept.base_value || 1);
    const amount = (Number(base_salary) * (percentage / 100)) * employeeInfo.seniority_years;
    totalRemunerative += amount;
    items.push({ 
      concept_id: antConcept.id, 
      code: 'ANT', 
      name: `Antigüedad (${employeeInfo.seniority_years} años)`, 
      amount, 
      base_amount: base_salary,
      category: 'remunerative' 
    });
  }

  // Horas Extra (Valor simple para el ejemplo)
  const extraHours = news.extra_hours_amount || 0;
  if (extraHours > 0) {
    const heConcept = concepts.find(c => c.code === 'HE50');
    totalRemunerative += extraHours;
    items.push({ concept_id: heConcept.id, code: 'HE50', name: heConcept.name, amount: extraHours, category: 'remunerative' });
  }

  // Presentismo (Ej: 8.33% sobre Básico + Antigüedad)
  const preConcept = concepts.find(c => c.code === 'PRE');
  if (preConcept && !news.has_absences) {
    const percentage = Number(preConcept.base_value || 8.33);
    const amount = totalRemunerative * (percentage / 100);
    totalRemunerative += amount;
    items.push({ 
      concept_id: preConcept.id, 
      code: 'PRE', 
      name: preConcept.name, 
      amount, 
      base_amount: totalRemunerative - amount,
      category: 'remunerative' 
    });
  }

  // 2. DEDUCCIONES (Se calculan sobre el Bruto Remunerativo)
  let totalDeductions = 0;
  const deductions = concepts.filter(c => c.category === 'deduction');

  deductions.forEach(d => {
    let amount = 0;
    if (d.is_percentage) {
      amount = totalRemunerative * (Number(d.base_value) / 100);
    } else {
      amount = Number(news[d.code.toLowerCase()] || 0);
    }

    if (amount > 0) {
      totalDeductions += amount;
      items.push({ 
        concept_id: d.id, 
        code: d.code, 
        name: d.name, 
        amount, 
        base_amount: totalRemunerative,
        category: 'deduction' 
      });
    }
  });

  // 3. NO REMUNERATIVOS
  let totalNonRemunerative = 0;
  const nonRem = concepts.filter(c => c.category === 'non_remunerative');
  
  nonRem.forEach(nr => {
    const amount = Number(news[nr.code.toLowerCase()] || 0);
    if (amount > 0) {
      totalNonRemunerative += amount;
      items.push({ concept_id: nr.id, code: nr.code, name: nr.name, amount, category: 'non_remunerative' });
    }
  });

  // 4. NETO FINAL
  const netSalary = (totalRemunerative - totalDeductions) + totalNonRemunerative;

  return {
    totals: {
      gross_salary: totalRemunerative,
      total_deductions: totalDeductions,
      total_non_remunerative: totalNonRemunerative,
      net_salary: netSalary
    },
    items
  };
};