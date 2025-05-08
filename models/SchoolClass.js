class SchoolClass {
    constructor(classId, name, section) {
      this.classId = classId;
      this.name = name;
      this.section = section;
    }
  
    // Convert to JSON (general use)
    toJSON() {
      return JSON.stringify({
        classId: this.classId,
        name: this.name,
        section: this.section,
      });
    }
  
    // Convert to SQLite-compatible JSON (optional if storing as string)
    toJSONForSQLite() {
      return JSON.stringify({
        class_id: this.classId,
        name: this.name,
        section: this.section,
      });
    }
  
    // Create an instance from a regular JSON string
    static fromJSON(jsonString) {
      const data = JSON.parse(jsonString);
      return new SchoolClass(data.classId, data.name, data.section);
    }
  
    // ✅ Create an instance from a row returned by SQLite
    static fromSQLiteRow(row) {
      return new SchoolClass(row.class_id, row.name, row.section);
    }
  }
  
  module.exports = SchoolClass;  