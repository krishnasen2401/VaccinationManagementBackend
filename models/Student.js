class Student {
  constructor(studentId, name, classId, dateOfBirth, guardians) {
    this.studentId = studentId;
    this.name = name;
    this.classId = classId; // classId now replaces classname
    this.dateOfBirth = dateOfBirth;
    this.guardians = Array.isArray(guardians)
      ? guardians.map((guardian) => ({
          name: guardian.name || "",
          phoneNumber: guardian.phoneNumber || "",
        }))
      : [];
  }

  // Convert the Student object to a JSON string (for general use)
  toJSON() {
    return JSON.stringify({
      studentId: this.studentId,
      name: this.name,
      classId: this.classId,
      dateOfBirth: this.dateOfBirth,
      guardians: this.guardians,
    });
  }

  // Convert the Student object to a format for SQLite (if needed)
  toJSONForSQLite() {
    return JSON.stringify({
      studentId: this.studentId,
      name: this.name,
      classId: this.classId,
      dateOfBirth: this.dateOfBirth,
      guardians: JSON.stringify(this.guardians),
    });
  }

  // Static method to create a Student object from a JSON string
  static fromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      return new Student(
        data.studentId,
        data.name,
        data.classId,
        data.dateOfBirth,
        data.guardians
      );
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }

  // Static method to create a Student object from a row returned by SQLite
  static fromSQLiteRow(row) {
    return new Student(
      row.student_id,
      row.name,
      row.class_id,
      row.date_of_birth,
      JSON.parse(row.guardians)
    );
  }
}

module.exports = Student;
