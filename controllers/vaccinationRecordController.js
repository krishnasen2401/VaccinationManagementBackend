const db = require('../database/db');
const VaccinationRecord = require('../models/VaccinationRecord');
const { getVaccineById } = require('./vaccineController');
const { getDriveByJustId } = require('./vaccinationDriveController');
const { getStudentById } = require('../controllers/studentController');

const addRecord = (record) => {
  const stmt = db.prepare(`
    INSERT INTO vaccination_records (
      record_id, student_id, date, drive_id,
      vaccine_id, administered_by, batch_id, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    record.recordId,
    record.studentId,
    record.date.toISOString(),
    record.driveId,
    record.vaccineId,
    record.administeredBy,
    record.batchId,
    record.notes
  );
};

const updateRecord = (record) => {
  const stmt = db.prepare(`
    UPDATE vaccination_records SET
      student_id = ?, date = ?, drive_id = ?, vaccine_id = ?,
      administered_by = ?, batch_id = ?, notes = ?
    WHERE record_id = ?
  `);
  stmt.run(
    record.studentId,
    record.date.toISOString(),
    record.driveId,
    record.vaccineId,
    record.administeredBy,
    record.batchId,
    record.notes,
    record.recordId
  );
};

const deleteRecordById = (id) => {
  db.prepare('DELETE FROM vaccination_records WHERE record_id = ?').run(id);
};

const getRecordById = (id) => {
  const row = db.prepare('SELECT * FROM vaccination_records WHERE record_id = ?').get(id);
  if (!row) return null;
  const record = VaccinationRecord.fromSQLiteRow(row);
  record.vaccine = getVaccineById(record.vaccineId);
  record.drive = getDriveByJustId(record.driveId);
  record.studentId=getStudentById(record.studentId);
  return record;
};

const getRecords = (filters = {}) => {
  const { studentId, vaccineId, driveId, fromDate, toDate } = filters;
  let query = `SELECT * FROM vaccination_records WHERE 1=1`;
  const params = [];

  if (studentId) {
    query += ' AND student_id = ?';
    params.push(studentId);
  }
  if (vaccineId) {
    query += ' AND vaccine_id = ?';
    params.push(vaccineId);
  }
  if (driveId) {
    query += ' AND drive_id = ?';
    params.push(driveId);
  }
  if (fromDate) {
    query += ' AND date >= ?';
    params.push(new Date(fromDate).toISOString());
  }
  if (toDate) {
    query += ' AND date <= ?';
    params.push(new Date(toDate).toISOString());
  }

  const rows = db.prepare(query).all(...params);
  return rows.map(row => {
    const record = VaccinationRecord.fromSQLiteRow(row);
    // const drive= getDriveByJustId(record.driveId);
    record.vaccine = getVaccineById(record.vaccineId);
    // record.drive = drive;
    record.studentId=getStudentById(record.studentId);
    return record;
  });
};

const isDuplicateVaccination = (studentId, vaccineId) => {
  const stmt = db.prepare(
    'SELECT COUNT(*) as count FROM vaccination_records WHERE student_id = ? AND vaccine_id = ?'
  );
  const result = stmt.get(studentId, vaccineId);
  return result.count > 0;
};

module.exports = {
  addRecord,
  updateRecord,
  deleteRecordById,
  getRecordById,
  getRecords,
  isDuplicateVaccination
};
