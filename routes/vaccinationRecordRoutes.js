const express = require('express');
const { v4: uuidv4 } = require('uuid');
const VaccinationRecord = require('../models/VaccinationRecord');
const {
  addRecord,
  updateRecord,
  deleteRecordById,
  getRecordById,
  getRecords
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
 *         - date
 *         - vaccineId
 *       properties:
 *         recordId:
 *           type: string
 *           format: uuid
 *         studentId:
 *           type: string
 *         date:
 *           type: string
 *           format: date
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
 *     summary: Get all vaccination records (with nested vaccine & drive)
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
 *         description: List of vaccination records with nested details
 */
router.get('/', (req, res) => {
  const records = getRecords(req.query);
  res.json(records);
});

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get vaccination record by ID (with nested details)
 *     tags: [VaccinationRecord]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Record with nested vaccine & drive info
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
 *     summary: Create a new vaccination record
 *     tags: [VaccinationRecord]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             studentId: "student-uuid"
 *             date: "2025-05-01T10:00:00Z"
 *             driveId: "drive-uuid"
 *             vaccineId: "vaccine-uuid"
 *             administeredBy: "user-uuid"
 *             batchId: "batch-001"
 *             notes: "No side effects"
 *     responses:
 *       201:
 *         description: Record created
 */
router.post('/', (req, res) => {
  const {
    studentId, date, driveId, vaccineId,
    administeredBy, batchId, notes
  } = req.body;
  const recordId = uuidv4();
  const record = new VaccinationRecord(
    recordId,
    studentId,
    new Date(date),
    driveId,
    vaccineId,
    administeredBy,
    batchId,
    notes
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
 *           example:
 *             recordId: "record-uuid"
 *             studentId: "student-uuid"
 *             date: "2025-05-01T10:00:00Z"
 *             driveId: "drive-uuid"
 *             vaccineId: "vaccine-uuid"
 *             administeredBy: "user-uuid"
 *             batchId: "batch-001"
 *             notes: "Updated notes"
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
    recordId,
    studentId,
    new Date(date),
    driveId,
    vaccineId,
    administeredBy,
    batchId,
    notes
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
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Record deleted
 */
router.delete('/:id', (req, res) => {
  deleteRecordById(req.params.id);
  res.json({ message: 'Record deleted successfully' });
});

module.exports = router;
