class SchoolClass {
  constructor(classId, name, section) {
    this.classId = classId;
    this.name = name;
    this.section = section;
  }

  toJSON() {
    return {
      classId: this.classId,
      name: this.name,
      section: this.section,
    };
  }

  toJSONForSQLite() {
    return JSON.stringify({
      class_id: this.classId,
      name: this.name,
      section: this.section,
    });
  }

  static fromJSON(jsonString) {
    const data = JSON.parse(jsonString);
    return new SchoolClass(data.classId, data.name, data.section);
  }

  static fromSQLiteRow(row) {
    return new SchoolClass(row.class_id, row.name, row.section);
  }
}

module.exports = SchoolClass;
