const SchoolClass = require('../models/SchoolClass');

const db = require('../database/db');

const addClass = (schoolClass) => {
  const stmt = db.prepare(`
    INSERT INTO classes (class_id, name, section)
    VALUES (?, ?, ?)
  `);
  stmt.run(schoolClass.classId, schoolClass.name, schoolClass.section);
};

const updateClass = (schoolClass) => {
  const stmt = db.prepare(`
    UPDATE classes
    SET name = ?, section = ?
    WHERE class_id = ?
  `);
  stmt.run(schoolClass.name, schoolClass.section, schoolClass.classId);
};

const deleteClassById = (classId) => {
  const stmt = db.prepare(`DELETE FROM classes WHERE class_id = ?`);
  stmt.run(classId);
};

const getClassById = (classId) => {
  const stmt = db.prepare(`SELECT * FROM classes WHERE class_id = ?`);
  const row = stmt.get(classId);
  return row ? SchoolClass.fromSQLiteRow(row) : null;
};

const getAllClasses = ({ name, section } = {}) => {
  let query = `SELECT * FROM classes WHERE 1=1`;
  const params = [];

  if (name) {
    query += ` AND name LIKE ?`;
    params.push(`%${name}%`);
  }

  if (section) {
    query += ` AND section = ?`;
    params.push(section);
  }

  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  return rows.map((row) => SchoolClass.fromSQLiteRow(row));
};

module.exports = {
  addClass,
  updateClass,
  deleteClassById,
  getClassById,
  getAllClasses,
};
