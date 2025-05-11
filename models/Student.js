class Student {
  constructor(studentId, name, classId, StudentID, dateOfBirth, guardians) {
    this.studentId = studentId;
    this.name = name;
    this.classId = classId;
    this.StudentID = StudentID;
    this.dateOfBirth = dateOfBirth;
    this.guardians = Array.isArray(guardians)
      ? guardians.map((guardian) => ({
          name: guardian.name || '',
          phoneNumber: guardian.phoneNumber || '',
        }))
      : [];
  }

  toJSON() {
    return {
      studentId: this.studentId,
      name: this.name,
      classId: this.classId,
      StudentID: this.StudentID,
      dateOfBirth: this.dateOfBirth,
      guardians: this.guardians,
    };
  }

  static fromSQLiteRow(row) {
    return new Student(
      row.student_id,
      row.name,
      row.class_id,
      row.StudentID,
      row.date_of_birth,
      JSON.parse(row.guardians)
    );
  }
}

module.exports = Student;
