class VaccinationRecord {
    constructor(
      recordId,        // Unique ID for this record
      studentId,
      date,
      driveId,
      vaccineId,
      administeredBy,  // User ID of who administered the vaccine
      batchId,
      notes            // Added notes
    ) {
      this.recordId = recordId;      //changed from vaccinationId to recordId to make it unique
      this.studentId = studentId;
      this.date = date;
      this.driveId = driveId;
      this.vaccineId = vaccineId;
      this.administeredBy = administeredBy;
      this.batchId = batchId;
      this.notes = notes;          //detail notes about the record
    }
  
    // Method to convert the VaccinationRecord object to a JSON string for SQLite storage
    toJSONForSQLite() {
      return JSON.stringify({
        recordId: this.recordId,
        studentId: this.studentId,
        date: this.date.toISOString(),
        driveId: this.driveId,
        vaccineId: this.vaccineId,
        administeredBy: this.administeredBy,
        batchId: this.batchId,
        notes: this.notes
      });
    }
  
    // Static method to create a VaccinationRecord object from a JSON string retrieved from SQLite
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
