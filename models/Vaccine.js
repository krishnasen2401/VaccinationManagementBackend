class Vaccine {
  constructor(
    vaccineId,
    vaccineName,
    manufacturer,
    dosage,
    description,
    storageRequirements,
    batches,
    dosesPerVial,
    vaccineType,
    administerBefore,
    countryOfOrigin,
    packageInsert,
    numberOfVials
  ) {
    this.vaccineId = vaccineId;
    this.vaccineName = vaccineName;
    this.manufacturer = manufacturer;
    this.dosage = dosage;
    this.description = description;
    this.storageRequirements = storageRequirements;
    this.batches = Array.isArray(batches) ? batches : [];
    this.dosesPerVial = dosesPerVial;
    this.vaccineType = vaccineType;
    this.administerBefore = administerBefore ? new Date(administerBefore) : null;
    this.countryOfOrigin = countryOfOrigin;
    this.packageInsert = packageInsert;
    this.numberOfVials = numberOfVials;
  }

  toJSONForSQLite() {
    return JSON.stringify({
      vaccineId: this.vaccineId,
      vaccineName: this.vaccineName,
      manufacturer: this.manufacturer,
      dosage: this.dosage,
      description: this.description,
      storageRequirements: this.storageRequirements,
      batches: JSON.stringify(
        this.batches.map((batch) => ({
          batchId: batch.batchId,
          expiryDate: batch.expiryDate ? batch.expiryDate.toISOString() : null,
          receivedDate: batch.receivedDate ? batch.receivedDate.toISOString() : null,
        }))
      ),
      dosesPerVial: this.dosesPerVial,
      vaccineType: this.vaccineType,
      administerBefore: this.administerBefore ? this.administerBefore.toISOString() : null,
      countryOfOrigin: this.countryOfOrigin,
      packageInsert: this.packageInsert,
      numberOfVials: this.numberOfVials,
    });
  }

  static fromJSONSQLite(jsonString) {
    const data = JSON.parse(jsonString);
    const batches = JSON.parse(data.batches).map((batch) => ({
      batchId: batch.batchId,
      expiryDate: batch.expiryDate ? new Date(batch.expiryDate) : null,
      receivedDate: batch.receivedDate ? new Date(batch.receivedDate) : null,
    }));
    return new Vaccine(
      data.vaccineId,
      data.vaccineName,
      data.manufacturer,
      data.dosage,
      data.description,
      data.storageRequirements,
      batches,
      data.dosesPerVial,
      data.vaccineType,
      data.administerBefore ? new Date(data.administerBefore) : null,
      data.countryOfOrigin,
      data.packageInsert,
      data.numberOfVials
    );
  }

  static fromSQLiteRow(row) {
    return new Vaccine(
      row.vaccine_id,
      row.vaccine_name,
      row.manufacturer,
      row.dosage,
      row.description,
      row.storage_requirements,
      JSON.parse(row.batches).map((batch) => ({
        batchId: batch.batchId,
        expiryDate: batch.expiryDate ? new Date(batch.expiryDate) : null,
        receivedDate: batch.receivedDate ? new Date(batch.receivedDate) : null,
      })),
      row.doses_per_vial,
      row.vaccine_type,
      row.administer_before,
      row.country_of_origin,
      row.package_insert,
      row.numberOfVials
    );
  }

  addBatch(newBatchId, expiryDate, receivedDate) {
    this.batches.push({
      batchId: newBatchId,
      expiryDate,
      receivedDate,
    });
  }
}

module.exports = Vaccine;
