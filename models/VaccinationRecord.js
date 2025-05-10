class VaccinationRecord {
  constructor(
    recordId,
    studentId,
    date,
    driveId,
    vaccineId,
    administeredBy,
    batchId,
    notes
  ) {
    this.recordId = recordId;
    this.studentId = studentId;
    this.date = new Date(date);
    this.driveId = driveId;
    this.vaccineId = vaccineId;
    this.administeredBy = administeredBy;
    this.batchId = batchId;
    this.notes = notes;
  }

  toObjectForSQLite() {
    return {
      record_id: this.recordId,
      student_id: this.studentId,
      date: this.date.toISOString(),
      drive_id: this.driveId,
      vaccine_id: this.vaccineId,
      administered_by: this.administeredBy,
      batch_id: this.batchId,
      notes: this.notes
    };
  }

  static fromSQLiteRow(row) {
    return new VaccinationRecord(
      row.record_id,
      row.student_id,
      new Date(row.date),
      row.drive_id,
      row.vaccine_id,
      row.administered_by,
      row.batch_id,
      row.notes
    );
  }

  static fromJSONSQLite(jsonString) {
    const data = JSON.parse(jsonString);
    return new VaccinationRecord(
      data.recordId,
      data.studentId,
      new Date(data.date),
      data.driveId,
      data.vaccineId,
      data.administeredBy,
      data.batchId,
      data.notes
    );
  }
}

module.exports = VaccinationRecord;