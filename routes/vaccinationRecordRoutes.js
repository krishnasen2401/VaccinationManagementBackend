const express = require('express');
const { v4: uuidv4 } = require('uuid');
const VaccinationRecord = require('../models/VaccinationRecord');
const {
  addRecord,
  updateRecord,
  deleteRecordById,
  getRecordById,
  getRecords,
  isDuplicateVaccination
} = require('../controllers/vaccinationRecordController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     VaccinationRecord:
 *       type: object
 *       required:
 *         - studentId
 *         - vaccineId
 *         - date
 *       properties:
 *         recordId:
 *           type: string
 *         studentId:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         driveId:
 *           type: string
 *         vaccineId:
 *           type: string
 *         administeredBy:
 *           type: string
 *         batchId:
 *           type: string
 *         notes:
 *           type: string
 */

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get vaccination records with filters
 *     tags: [VaccinationRecord]
 *     parameters:
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *       - in: query
 *         name: vaccineId
 *         schema:
 *           type: string
 *       - in: query
 *         name: driveId
 *         schema:
 *           type: string
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of vaccination records
 */
router.get('/', (req, res) => {
  const records = getRecords(req.query);
  res.json(records);
});

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get a vaccination record by ID
 *     tags: [VaccinationRecord]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record found
 *       404:
 *         description: Not found
 */
router.get('/:id', (req, res) => {
  const record = getRecordById(req.params.id);
  record
    ? res.json(record)
    : res.status(404).json({ message: 'Record not found' });
});

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Add a new vaccination record
 *     tags: [VaccinationRecord]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:{
 *             studentId: "student-uuid"
 *             date: "2025-05-01T10:00:00Z"
 *             driveId: "drive-uuid"
 *             vaccineId: "vaccine-uuid"
 *             administeredBy: "user-uuid"
 *             batchId: "batch-123"
 *             notes: "No side effects"
 *            }
 *     responses:
 *       201:
 *         description: Record created
 *       409:
 *         description: Duplicate vaccination
 */
router.post('/', (req, res) => {
  const {
    studentId, date, driveId, vaccineId,
    administeredBy, batchId, notes
  } = req.body;

  if (isDuplicateVaccination(studentId, vaccineId)) {
    return res.status(409).json({ message: 'Student already vaccinated with this vaccine' });
  }

  const record = new VaccinationRecord(
    uuidv4(), studentId, new Date(date), driveId,
    vaccineId, administeredBy, batchId, notes
  );
  addRecord(record);
  res.status(201).json(record);
});

/**
 * @swagger
 * /records:
 *   put:
 *     summary: Update a vaccination record
 *     tags: [VaccinationRecord]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:{
 *             recordId: "record-uuid"
 *             studentId: "student-uuid"
 *             ...
 * }
 *     responses:
 *       200:
 *         description: Record updated
 */
router.put('/', (req, res) => {
  const {
    recordId, studentId, date, driveId,
    vaccineId, administeredBy, batchId, notes
  } = req.body;

  const record = new VaccinationRecord(
    recordId, studentId, new Date(date), driveId,
    vaccineId, administeredBy, batchId, notes
  );
  updateRecord(record);
  res.json({ message: 'Record updated successfully' });
});

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Delete a vaccination record
 *     tags: [VaccinationRecord]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted
 */
router.delete('/:id', (req, res) => {
  deleteRecordById(req.params.id);
  res.json({ message: 'Record deleted successfully' });
});

module.exports = router;
