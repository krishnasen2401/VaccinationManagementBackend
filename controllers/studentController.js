const Student = require('../models/Student');

const db = require('../database/db');
const { getClassById } = require('../controllers/classController');

const addStudent = (student) => {
  const stmt = db.prepare(`
    INSERT INTO students (student_id, name, class_id, StudentID, date_of_birth, guardians)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    student.studentId,
    student.name,
    student.classId,
    student.StudentID,
    student.dateOfBirth,
    JSON.stringify(student.guardians)
  );
};

const updateStudent = (student) => {
  const stmt = db.prepare(`
    UPDATE students
    SET name = ?, class_id = ?, StudentID = ?, date_of_birth = ?, guardians = ?
    WHERE student_id = ?
  `);
  stmt.run(
    student.name,
    student.classId,
    student.StudentID,
    student.dateOfBirth,
    JSON.stringify(student.guardians),
    student.studentId
  );
};

const getStudentById = (studentId) => {
  const stmt = db.prepare(`SELECT * FROM students WHERE student_id = ?`);
  const row = stmt.get(studentId);
  const student=Student.fromSQLiteRow(row);
  const classObj = getClassById(student.classId);
  student.classId = classObj;
  return row ? student : null;
};

const getAllStudents = (filters = {}) => {
  const { name, studentId, classId, dateOfBirth, guardianPhone } = filters;

  let query = `SELECT * FROM students WHERE 1=1`;
  const params = [];

  if (name) {
    query += ` AND name LIKE ?`;
    params.push(`%${name}%`);
  }
  if (studentId) {
    query += ` AND StudentID = ?`;
    params.push(studentId);
  }
  if (classId) {
    query += ` AND class_id = ?`;
    params.push(classId);
  }
  if (dateOfBirth) {
    query += ` AND date_of_birth = ?`;
    params.push(dateOfBirth);
  }
  if (guardianPhone) {
    query += ` AND EXISTS (
      SELECT 1 FROM json_each(guardians)
      WHERE json_each.value ->> 'phoneNumber' = ?
    )`;
    params.push(guardianPhone);
  }

  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  return rows.map((row) => {
    const student = Student.fromSQLiteRow(row);
    const classObj = getClassById(student.classId);
    student.classId = classObj;
    return student;
  });
};

const deleteStudentById = (studentId) => {
  const stmt = db.prepare(`DELETE FROM students WHERE student_id = ?`);
  stmt.run(studentId);
};

module.exports = {
  addStudent,
  updateStudent,
  getStudentById,
  getAllStudents,
  deleteStudentById,
};
