import sqlite3 from 'sqlite3';
import { app } from 'electron';
import path from 'path';

// Get the user data path, which is a safe place to store app data
const userDataPath = app.getPath('userData');
// Define the path for our database file
const dbPath = path.join(userDataPath, 'hr-dashboard.db');

// Create a new database instance. The verbose() method provides more detailed stack traces.
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database opening error: ', err);
  } else {
    console.log(`Database opened successfully at ${dbPath}`);
  }
});

// SQL statement to create the employees table
const createTableSql = `
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    dob TEXT NOT NULL,
    emiratesId TEXT UNIQUE,
    passportNumber TEXT UNIQUE,
    salary REAL,
    emiratesIdFrontPath TEXT,
    emiratesIdBackPath TEXT,
    passportImgPath TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

/**
 * Initializes the database, creating the necessary tables if they don't exist.
 */
export const initDatabase = () => {
  db.run(createTableSql, (err) => {
    if (err) {
      console.error('Error creating table: ', err);
    } else {
      console.log('Employees table created or already exists.');
    }
  });
};

/**
 * Retrieves all employees from the database.
 * @returns A promise that resolves with an array of employee objects.
 */
export const getAllEmployees = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM employees ORDER BY createdAt DESC', (err, rows) => {
      if (err) {
        console.error('Error getting employees:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

/**
 * Adds a new employee to the database.
 * @param employee - The employee data to add.
 * @returns A promise that resolves when the employee has been added.
 */
export const addEmployee = (employee: any): Promise<void> => {
  const sql = `
    INSERT INTO employees
    (firstName, lastName, dob, emiratesId, passportNumber, salary, emiratesIdFrontPath, emiratesIdBackPath, passportImgPath)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    employee.firstName,
    employee.lastName,
    employee.dob,
    employee.emiratesId,
    employee.passportNumber,
    employee.salary,
    employee.emiratesIdFrontPath,
    employee.emiratesIdBackPath,
    employee.passportImgPath,
  ];

  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) {
        console.error('Error adding employee:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Updates an existing employee in the database.
 * @param id - The ID of the employee to update.
 * @param employee - The updated employee data.
 * @returns A promise that resolves when the employee has been updated.
 */
export const updateEmployee = (id: number, employee: any): Promise<void> => {
  const sql = `
    UPDATE employees SET
      firstName = ?, lastName = ?, dob = ?, emiratesId = ?, passportNumber = ?,
      salary = ?, emiratesIdFrontPath = ?, emiratesIdBackPath = ?, passportImgPath = ?
    WHERE id = ?
  `;
  const params = [
    employee.firstName, employee.lastName, employee.dob, employee.emiratesId,
    employee.passportNumber, employee.salary, employee.emiratesIdFrontPath,
    employee.emiratesIdBackPath, employee.passportImgPath, id
  ];

  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) {
        console.error('Error updating employee:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Deletes an employee from the database.
 * @param id - The ID of the employee to delete.
 * @returns A promise that resolves when the employee has been deleted.
 */
export const deleteEmployee = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM employees WHERE id = ?', [id], (err) => {
      if (err) {
        console.error('Error deleting employee:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Export the database instance for use in other modules
export default db;
