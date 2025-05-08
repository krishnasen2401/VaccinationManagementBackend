const Database = require('better-sqlite3');
const SchoolClass = require('../SchoolClass');

const db = new Database('./database/vaccination_data.db');

// Insert a new class
const addClass = (schoolClass) => {
  const stmt = db.prepare(`
    INSERT INTO classes (class_id, name, section)
    VALUES (?, ?, ?)
  `);
  stmt.run(
    schoolClass.classId,
    schoolClass.name,
    schoolClass.section
  );
};

// Modify an existing class
const updateClass = (schoolClass) => {
  const stmt = db.prepare(`
    UPDATE classes
    SET name = ?, section = ?
    WHERE class_id = ?
  `);
  stmt.run(
    schoolClass.name,
    schoolClass.section,
    schoolClass.classId
  );
};

// Delete a class by ID
const deleteClassById = (classId) => {
  const stmt = db.prepare(`DELETE FROM classes WHERE class_id = ?`);
  stmt.run(classId);
};

// Get a class by ID
const getClassById = (classId) => {
  const stmt = db.prepare(`SELECT * FROM classes WHERE class_id = ?`);
  const row = stmt.get(classId);
  return row ? SchoolClass.fromSQLiteRow(row) : null;
};

// Get all classes
const getAllClasses = () => {
  const stmt = db.prepare(`SELECT * FROM classes`);
  const rows = stmt.all();
  return rows.map(row => SchoolClass.fromSQLiteRow(row));
};

module.exports = {
  addClass,
  updateClass,
  deleteClassById,
  getClassById,
  getAllClasses,
};
