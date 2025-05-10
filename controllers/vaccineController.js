const Vaccine = require('../models/Vaccine');

const addVaccine = (vaccine) => {
  const stmt = db.prepare(`
    INSERT INTO vaccines (
      vaccine_id, vaccine_name, manufacturer, dosage, description,
      storage_requirements, batches, doses_per_vial, vaccine_type,
      administer_before, country_of_origin, package_insert, numberOfVials
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    vaccine.vaccineId,
    vaccine.vaccineName,
    vaccine.manufacturer,
    vaccine.dosage,
    vaccine.description,
    vaccine.storageRequirements,
    JSON.stringify(vaccine.batches),
    vaccine.dosesPerVial,
    vaccine.vaccineType,
    vaccine.administerBefore,
    vaccine.countryOfOrigin,
    vaccine.packageInsert,
    vaccine.numberOfVials
  );
};

const updateVaccine = (vaccine) => {
  const stmt = db.prepare(`
    UPDATE vaccines SET
      vaccine_name = ?, manufacturer = ?, dosage = ?, description = ?,
      storage_requirements = ?, batches = ?, doses_per_vial = ?,
      vaccine_type = ?, administer_before = ?, country_of_origin = ?,
      package_insert = ?, numberOfVials = ?
    WHERE vaccine_id = ?
  `);
  stmt.run(
    vaccine.vaccineName,
    vaccine.manufacturer,
    vaccine.dosage,
    vaccine.description,
    vaccine.storageRequirements,
    JSON.stringify(vaccine.batches),
    vaccine.dosesPerVial,
    vaccine.vaccineType,
    vaccine.administerBefore,
    vaccine.countryOfOrigin,
    vaccine.packageInsert,
    vaccine.numberOfVials,
    vaccine.vaccineId
  );
};

const deleteVaccineById = (id) => {
  db.prepare('DELETE FROM vaccines WHERE vaccine_id = ?').run(id);
};

const getVaccineById = (id) => {
  const row = db.prepare('SELECT * FROM vaccines WHERE vaccine_id = ?').get(id);
  return row ? Vaccine.fromSQLiteRow(row) : null;
};

const getVaccines = (filters = {}) => {
  const { name, manufacturer, type, batchId } = filters;
  let query = `SELECT * FROM vaccines WHERE 1=1`;
  const params = [];

  if (name) {
    query += ` AND vaccine_name LIKE ?`;
    params.push(`%${name}%`);
  }
  if (manufacturer) {
    query += ` AND manufacturer LIKE ?`;
    params.push(`%${manufacturer}%`);
  }
  if (type) {
    query += ` AND vaccine_type = ?`;
    params.push(type);
  }
  if (batchId) {
    query += ` AND EXISTS (
      SELECT 1 FROM json_each(batches)
      WHERE json_each.value ->> 'batchId' = ?
    )`;
    params.push(batchId);
  }

  const stmt = db.prepare(query);
  return stmt.all(...params).map(Vaccine.fromSQLiteRow);
};

module.exports = {
  addVaccine,
  updateVaccine,
  deleteVaccineById,
  getVaccineById,
  getVaccines
};
