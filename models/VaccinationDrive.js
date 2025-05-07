const Vaccine = require('./Vaccine'); // Import the Vaccine class

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
    vaccines // Changed vaccines property to an array of Vaccine objects
  ) {
    this.driveId = driveId;
    this.name = name;
    this.createdBy = createdBy;
    this.startDate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.targetClasses = targetClasses;
    this.notes = notes;
    this.status = status;
    this.vaccines = Array.isArray(vaccines) ? vaccines.map(v => new Vaccine(v.vaccineId,v.vaccineName,v.manufacturer,v.dosage,v.description,v.storageRequirements,v.batches,v.dosesPerVial,v.vaccineType,v.administerBefore,v.countryOfOrigin,v.packageInsert,v.numberOfVials)) : []; // Initialize as an array of Vaccine objects
  }

  // Method to convert the VaccinationDrive object to a JSON string for SQLite storage
  toJSONForSQLite() {
    return JSON.stringify({
      driveId: this.driveId,
      name: this.name,
      createdBy: this.createdBy,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      location: this.location,
      targetClasses: JSON.stringify(this.targetClasses),
      notes: this.notes,
      status: this.status,
      vaccines: this.vaccines.map(vaccine => vaccine.toJSONForSQLite()), // Use Vaccine's toJSONForSQLite
    });
  }

  // Static method to create a VaccinationDrive object from a JSON string retrieved from SQLite
  static fromJSONSQLite(jsonString) {
    const data = JSON.parse(jsonString);
    const vaccines = JSON.parse(data.vaccines).map(vaccineData => Vaccine.fromJSONSQLite(vaccineData)); // Use Vaccine's fromJSONSQLite
    return new VaccinationDrive(
      data.driveId,
      data.name,
      data.createdBy,
      new Date(data.startDate),
      new Date(data.endDate),
      data.location,
      JSON.parse(data.targetClasses),
      data.notes,
      data.status,
      vaccines
    );
  }

  /**
   * Adds a vaccine to the vaccination drive.
   * @param vaccine - The vaccine object to add.
   */
  addVaccine(vaccine) {
    this.vaccines.push(vaccine);
  }
}

module.exports = VaccinationDrive;