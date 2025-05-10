const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const {
  addStudent,
  updateStudent,
  getStudentById,
  getAllStudents,
  deleteStudentById,
} = require('../controllers/studentController');
const Student = require('../models/Student');

/**
 * @swagger
 * components:
 *   schemas:
 *     Guardian:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Jane Doe"
 *         phoneNumber:
 *           type: string
 *           example: "9876543210"
 *     Student:
 *       type: object
 *       required:
 *         - name
 *         - classId
 *         - StudentID
 *         - dateOfBirth
 *       properties:
 *         studentId:
 *           type: string
 *           format: uuid
 *           description: Auto-generated internal ID
 *           example: "c3d8fc3e-1e48-44aa-a769-0c51293fbd2b"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         classId:
 *           type: string
 *           format: uuid
 *           example: "d2b1aef4-3f24-4c65-9886-25cd3fe49a12"
 *         StudentID:
 *           type: string
 *           description: Visible roll number or admission number
 *           example: "10A-023"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "2008-06-15"
 *         guardians:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Guardian'
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students with optional filters
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Partial match on student name
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *         description: Filter by StudentID (visible roll number)
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *         description: Filter by class UUID
 *       - in: query
 *         name: dateOfBirth
 *         schema:
 *           type: string
 *           format: date
 *         description: Exact match on date of birth
 *       - in: query
 *         name: guardianPhone
 *         schema:
 *           type: string
 *         description: Exact match on a guardian's phone number
 *     responses:
 *       200:
 *         description: List of students matching filters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get('/', (req, res) => {
  const filters = {
    name: req.query.name,
    studentId: req.query.studentId,
    classId: req.query.classId,
    dateOfBirth: req.query.dateOfBirth,
    guardianPhone: req.query.guardianPhone,
  };
  const students = getAllStudents(filters);
  res.json(students);
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by internal UUID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Student found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 */
router.get('/:id', (req, res) => {
  const student = getStudentById(req.params.id);
  student
    ? res.json(student)
    : res.status(404).json({ message: 'Student not found' });
});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Add a new student (UUID auto-generated)
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Alice Smith"
 *             classId: "a7b1cfc8-2c1b-4c24-bac1-8fbc3a1c1234"
 *             StudentID: "10B-045"
 *             dateOfBirth: "2009-02-10"
 *             guardians:
 *               - name: "Bob Smith"
 *                 phoneNumber: "9123456789"
 *     responses:
 *       201:
 *         description: Student added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */
router.post('/', (req, res) => {
  const studentUUID = uuidv4();
  const { name, classId, StudentID, dateOfBirth, guardians } = req.body;
  const student = new Student(studentUUID, name, classId, StudentID, dateOfBirth, guardians);
  addStudent(student);
  res.status(201).json(student);
});

/**
 * @swagger
 * /students:
 *   put:
 *     summary: Update an existing student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             studentId: "c3d8fc3e-1e48-44aa-a769-0c51293fbd2b"
 *             name: "John Doe Updated"
 *             classId: "d2b1aef4-3f24-4c65-9886-25cd3fe49a12"
 *             StudentID: "10A-023"
 *             dateOfBirth: "2008-06-15"
 *             guardians:
 *               - name: "Jane Doe"
 *                 phoneNumber: "9876543210"
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student updated successfully
 */
router.put('/', (req, res) => {
  const { studentId, name, classId, StudentID, dateOfBirth, guardians } = req.body;
  const student = new Student(studentId, name, classId, StudentID, dateOfBirth, guardians);
  updateStudent(student);
  res.json({ message: 'Student updated successfully' });
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student by internal UUID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student deleted successfully
 */
router.delete('/:id', (req, res) => {
  deleteStudentById(req.params.id);
  res.json({ message: 'Student deleted successfully' });
});

module.exports = router;
