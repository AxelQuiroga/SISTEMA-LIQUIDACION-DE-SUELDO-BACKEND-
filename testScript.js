// === SCRIPT DE PRUEBA COMPLETO ===

import * as employeeService from "./src/services/employeeService.js";
import * as payrollService from "./src/services/payrollService.js";
import pool from "./src/config/db.js";

const runTest = async () => {
  try {
    console.log("=== INICIO DEL SCRIPT DE PRUEBA ===");

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
    const payroll = await payrollService.createPayroll({
      employee_id: emp.id,
      period: "2026-03",
      gross_salary: 3000,
      deductions: 300,
      bonuses: 10, // opcional, ejemplo
      extra_hours: 0,
      created_by: 1, // admin id
    });
    console.log("Payroll creado:", payroll);

    // 4️⃣ Leer empleado y payroll
    const fetchedEmp = await employeeService.getEmployeeById(emp.id);
    const fetchedPayroll = await payrollService.getPayrollById(payroll.id);
    console.log("Empleado fetch:", fetchedEmp);
    console.log("Payroll fetch:", fetchedPayroll);

    // 5️⃣ Actualizar empleado
    const updatedEmp = await employeeService.updateEmployee(emp.id, {
      ...fetchedEmp,
      position: "Tester Senior",
      base_salary: 3500,
    });
    console.log("Empleado actualizado:", updatedEmp);

    // 6️⃣ Actualizar payroll (recalculando net_salary)
    const updatedPayroll = await payrollService.updatePayroll(payroll.id, {
      gross_salary: 3500,
      deductions: 350,
      bonuses: 50,
      extra_hours: 2,
    });
    console.log("Payroll actualizado:", updatedPayroll);

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
