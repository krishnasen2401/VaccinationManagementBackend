class VaccinationDrive {
  constructor(
    driveId,
    name,
    createdBy,
    startDate,
    endDate,
    location,
    targetClasses,
    notes,
    status,
    vaccines // now an array of vaccineIds (or hydrated objects from controller)
  ) {
    this.driveId = driveId;
    this.name = name;
    this.createdBy = createdBy;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
    this.location = location;
    this.targetClasses = Array.isArray(targetClasses) ? targetClasses : [];
    this.notes = notes;
    this.status = status;
    this.vaccines = Array.isArray(vaccines) ? vaccines : []; // could be IDs or full objects (for output)
  }

  /**
   * Convert drive to an object for database insertion.
   * Stores only vaccineIds (not full objects).
   */
  toObjectForSQLite() {
    return {
      drive_id: this.driveId,
      name: this.name,
      created_by: this.createdBy,
      start_date: this.startDate.toISOString(),
      end_date: this.endDate.toISOString(),
      location: this.location,
      target_classes: JSON.stringify(this.targetClasses),
      notes: this.notes,
      status: this.status,
      vaccines: JSON.stringify(
        this.vaccines.map(v =>
          typeof v === 'string' ? v : v.vaccineId // if already hydrated, use ID
        )
      )
    };
  }

  /**
   * Recreate from a SQLite row with full vaccine objects
   */
  static fromSQLiteRow(row) {
    return new VaccinationDrive(
      row.drive_id,
      row.name,
      row.created_by,
      row.start_date,
      row.end_date,
      row.location,
      JSON.parse(row.target_classes),
      row.notes,
      row.status,
      row.vaccines ? JSON.parse(row.vaccines) : []
    );
  }
}

module.exports = VaccinationDrive;
