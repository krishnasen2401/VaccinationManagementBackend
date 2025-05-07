class Vaccine {
    constructor(
      vaccineId,
      vaccineName,
      manufacturer,
      dosage,
      description,
      storageRequirements,
      batches, // Changed to array of batch objects
      dosesPerVial,
      vaccineType,
      administerBefore,
      countryOfOrigin,
      packageInsert,
      numberOfVials // Added numberOfVials
    ) {
      this.vaccineId = vaccineId;
      this.vaccineName = vaccineName;
      this.manufacturer = manufacturer;
      this.dosage = dosage;
      this.description = description;
      this.storageRequirements = storageRequirements;
      this.batches = Array.isArray(batches) ? batches : []; // Ensure batches is always an array
      this.dosesPerVial = dosesPerVial;
      this.vaccineType = vaccineType;
      this.administerBefore = administerBefore;
      this.countryOfOrigin = countryOfOrigin;
      this.packageInsert = packageInsert;
      this.numberOfVials = numberOfVials; // Store the number of vials per package
    }
  
    // Method to convert the Vaccine object to a JSON string for SQLite storage
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
            //added null checks
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
        numberOfVials: this.numberOfVials, // Include in JSON
      });
    }
  
    // Static method to create a Vaccine object from a JSON string retrieved from SQLite
    static fromJSONSQLite(jsonString) {
      const data = JSON.parse(jsonString);
      const batches = JSON.parse(data.batches).map((batch) => ({
        //added null checks
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
        data.numberOfVials // Include from JSON
      );
    }
  
    /**
     * Adds a new batch ID and its expiry date to the vaccine's batch list.
     * @param newBatchId - The new batch ID to add.
     * @param expiryDate - The expiry date of the batch.
     * @param receivedDate - The date the batch was received.
     */
    addBatch(newBatchId, expiryDate, receivedDate) {
      this.batches.push({ batchId: newBatchId, expiryDate: expiryDate, receivedDate: receivedDate });
    }
  }