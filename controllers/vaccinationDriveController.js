const db = require('../database/db');
const VaccinationDrive = require('../models/VaccinationDrive');
const { getVaccineById } = require('./vaccineController');

const addDrive = (drive) => {
  const stmt = db.prepare(`
    INSERT INTO vaccination_drives (
      drive_id, name, created_by, start_date, end_date,
      location, target_classes, notes, status, vaccines
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const dbObj = drive.toObjectForSQLite();
  stmt.run(
    dbObj.drive_id,
    dbObj.name,
    dbObj.created_by,
    dbObj.start_date,
    dbObj.end_date,
    dbObj.location,
    dbObj.target_classes,
    dbObj.notes,
    dbObj.status,
    dbObj.vaccines
  );
};

const updateDrive = (drive) => {
  const stmt = db.prepare(`
    UPDATE vaccination_drives SET
      name = ?, start_date = ?, end_date = ?, location = ?,
      target_classes = ?, notes = ?, status = ?, vaccines = ?
    WHERE drive_id = ?
  `);
  const dbObj = drive.toObjectForSQLite();
  stmt.run(
    dbObj.name,
    dbObj.start_date,
    dbObj.end_date,
    dbObj.location,
    dbObj.target_classes,
    dbObj.notes,
    dbObj.status,
    dbObj.vaccines,
    dbObj.drive_id
  );
};

const deleteDriveById = (id) => {
  db.prepare('DELETE FROM vaccination_drives WHERE drive_id = ?').run(id);
};

const getDriveById = (id) => {
  const row = db.prepare('SELECT * FROM vaccination_drives WHERE drive_id = ?').get(id);
  return row ? fromRow(row) : null;
};

const getAllDrives = (filters = {}) => {
  const { status, targetClass, vaccineName } = filters;
  let query = `SELECT * FROM vaccination_drives WHERE 1=1`;
  const params = [];
  const now = new Date().toISOString();

  if (status) {
    if (status === 'upcoming') {
      query += ' AND start_date > ?';
      params.push(now);
    } else if (status === 'ongoing') {
      query += ' AND start_date <= ? AND end_date >= ?';
      params.push(now, now);
    } else if (status === 'completed') {
      query += ' AND end_date < ?';
      params.push(now);
    }
  }

  if (targetClass) {
    query += `
      AND EXISTS (
        SELECT 1 FROM json_each(target_classes)
        WHERE json_each.value = ?
      )`;
    params.push(targetClass);
  }

  if (vaccineName) {
    query += `
      AND EXISTS (
        SELECT 1 FROM json_each(vaccines)
        WHERE json_each.value IN (
          SELECT vaccine_id FROM vaccines WHERE vaccine_name = ?
        )
      )`;
    params.push(vaccineName);
  }

  const rows = db.prepare(query).all(...params);
  return rows.map(fromRow);
};

function fromRow(row) {
  const vaccineIds = JSON.parse(row.vaccines || '[]');
  const fullVaccineObjects = vaccineIds.map(id => getVaccineById(id)).filter(Boolean);
  return new VaccinationDrive(
    row.drive_id,
    row.name,
    row.created_by,
    row.start_date,
    row.end_date,
    row.location,
    JSON.parse(row.target_classes || '[]'),
    row.notes,
    row.status,
    fullVaccineObjects
  );
}

module.exports = {
  addDrive,
  updateDrive,
  deleteDriveById,
  getDriveById,
  getAllDrives
};
