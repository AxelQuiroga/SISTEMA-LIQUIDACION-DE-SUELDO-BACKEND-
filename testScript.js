// === SCRIPT DE PRUEBA COMPLETO ===

import * as employeeService from "./src/services/employeeService.js";
import * as payrollService from "./src/services/payrollService.js";
import pool from "./src/config/db.js";

const runTest = async () => {
  try {
    console.log("=== INICIO DEL SCRIPT DE PRUEBA ===");

    // Limpiar para testear de cero
    await pool.query("TRUNCATE TABLE payroll_items CASCADE");
    await pool.query("TRUNCATE TABLE payrolls CASCADE");
    await pool.query("DELETE FROM employees CASCADE");

    // 1️⃣ Generar un DNI único aleatorio
    const dniRandom = Math.floor(Math.random() * 90000000) + 10000000; // 10000000 a 99999999
    const users = await pool.query("SELECT id FROM users");

    if (users.rows.length === 0) {
      throw new Error("No hay usuarios en la tabla users");
    }

    const randomUser =
      users.rows[Math.floor(Math.random() * users.rows.length)].id;
    // 2️⃣ Crear empleado de prueba
    const emp = await employeeService.createEmployee({
      user_id: randomUser, // usuario existente en tabla users
      first_name: "Test",
      last_name: "Empleado",
      dni: dniRandom.toString(),
      hire_date: new Date(),
      position: "Tester",
      base_salary: 3000,
    });
    console.log("Empleado creado:", emp);

    // 3️⃣ Crear payroll asociado a este empleado
    // Vamos a probar con una fecha de ingreso de hace 5 años para testear antigüedad
    await pool.query("UPDATE employees SET hire_date = '2019-01-01' WHERE id = $1", [emp.id]);
    
    console.log("Calculando recibo para un empleado con 5 años de antigüedad...");
    const payroll = await payrollService.createPayroll({
      employee_id: emp.id,
      period: "2024-04",
      news: {
        extra_hours_amount: 10000, // 10 lucas de extras
        via: 5000,                 // 5 lucas de viáticos (no rem)
        has_absences: false        // Debería cobrar presentismo
      },
      created_by: randomUser
    });
    console.log("Payroll creado con éxito:", JSON.stringify(payroll, null, 2));

    // 4️⃣ Leer el recibo con sus ítems
    const items = await pool.query(`
      SELECT pi.amount, pc.name, pc.category, pi.base_amount 
      FROM payroll_items pi 
      JOIN payroll_concepts pc ON pi.concept_id = pc.id 
      WHERE pi.payroll_id = $1
    `, [payroll.id]);
    
    console.log("Detalle de conceptos liquidados:");
    console.table(items.rows);

    // 5️⃣ Probar una actualización
    console.log("Actualizando recibo (agregando inasistencia)...");
    const updatedPayroll = await payrollService.updatePayroll(payroll.id, {
      period: "2024-04",
      news: {
        extra_hours_amount: 10000,
        via: 5000,
        has_absences: true // Ahora debería perder el presentismo
      }
    });
    console.log("Payroll actualizado:", JSON.stringify(updatedPayroll, null, 2));


    // 7️⃣ Eliminar payroll
    /*const deletedPayroll = await payrollService.deletePayroll(payroll.id);
    console.log("Payroll eliminado:", deletedPayroll);

    // 8️⃣ Eliminar empleado
    const deletedEmp = await employeeService.deleteEmployee(emp.id);
    console.log("Empleado eliminado:", deletedEmp);*/

    console.log("=== FIN DEL SCRIPT DE PRUEBA ===");
  } catch (error) {
    console.error("Error en script de prueba:", error.message);
  }
};

// Ejecutar script
runTest();
