class Student {
    constructor(studentId, name, classname, dateOfBirth, guardians) {
      this.studentId = studentId;
      this.name = name;
      this.classname = classname;
      this.dateOfBirth = dateOfBirth;
      this.guardians = Array.isArray(guardians)
        ? guardians.map((guardian) => ({
            name: guardian.name || "",
            phoneNumber: guardian.phoneNumber || "",
          }))
        : [];
    }
  
    // Method to convert the Student object to a JSON string
    toJSON() {
      return JSON.stringify({
        studentId: this.studentId,
        name: this.name,
        classname: this.classname,
        dateOfBirth: this.dateOfBirth,
        guardians: this.guardians, // The guardians array will be stringified correctly
      });
    }
  
    // Static method to create a Student object from a JSON string
    static fromJSON(jsonString) {
      try {
        const data = JSON.parse(jsonString);
        return new Student(
          data.studentId,
          data.name,
          data.classname,
          data.dateOfBirth,
          data.guardians // This should already be an array of { name, phoneNumber } objects
        );
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return null; // Or handle the error as appropriate for your application
      }
    }
  }
  module.exports = Student;