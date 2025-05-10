const express = require('express');
const { v4: uuidv4 } = require('uuid');
const VaccinationDrive = require('../models/VaccinationDrive');
const {
  addDrive,
  updateDrive,
  deleteDriveById,
  getDriveById,
  getAllDrives
} = require('../controllers/vaccinationDriveController');
const { getVaccineById } = require('../controllers/vaccineController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vaccine:
 *       type: object
 *       properties:
 *         vaccineId: { type: string }
 *         vaccineName: { type: string }
 *         manufacturer: { type: string }
 *         dosage: { type: string }
 *         description: { type: string }
 *         storageRequirements: { type: string }
 *         dosesPerVial: { type: integer }
 *         vaccineType: { type: string }
 *         administerBefore: { type: string }
 *         countryOfOrigin: { type: string }
 *         packageInsert: { type: string }
 *         numberOfVials: { type: integer }
 *         batches:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               batchId: { type: string }
 *               expiryDate: { type: string }
 *               receivedDate: { type: string }

 *     VaccinationDrive:
 *       type: object
 *       properties:
 *         driveId: { type: string }
 *         name: { type: string }
 *         createdBy: { type: string }
 *         startDate: { type: string }
 *         endDate: { type: string }
 *         location: { type: string }
 *         targetClasses:
 *           type: array
 *           items: { type: string }
 *         notes: { type: string }
 *         status: { type: string }
 *         vaccines:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Vaccine'
 *         registeredStudents: { type: integer }
 *         vaccinatedStudents: { type: integer }
 *         expectedTotalDoses: { type: integer }
 *         totalVaccinationRecords: { type: integer }
 *         percentVaccinated: { type: number }

 */

/**
 * @swagger
 * /drives:
 *   get:
 *     summary: Get all vaccination drives with analytics
 *     tags: [VaccinationDrive]
 *     responses:
 *       200:
 *         description: List of enriched drives
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VaccinationDrive'
 */
router.get('/', (req, res) => {
  const drives = getAllDrives(req.query);
  res.json(drives);
});

/**
 * @swagger
 * /drives/{id}:
 *   get:
 *     summary: Get a single vaccination drive with analytics
 *     tags: [VaccinationDrive]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A vaccination drive
 *         content:
 *           application/json:
 *             example:
 *               driveId: "abc123"
 *               name: "Polio Drive"
 *               createdBy: "user-uuid"
 *               startDate: "2025-06-01T00:00:00Z"
 *               endDate: "2025-06-05T00:00:00Z"
 *               location: "Greenfield School"
 *               targetClasses: ["class-1"]
 *               notes: "Routine immunization"
 *               status: "ongoing"
 *               vaccines:
 *                 - vaccineId: "vax001"
 *                   vaccineName: "Polio"
 *               registeredStudents: 80
 *               vaccinatedStudents: 72
 *               expectedTotalDoses: 80
 *               totalVaccinationRecords: 72
 *               percentVaccinated: 90
 *       404:
 *         description: Drive not found
 */
router.get('/:id', (req, res) => {
  const drive = getDriveById(req.params.id);
  drive ? res.json(drive) : res.status(404).json({ message: 'Drive not found' });
});

/**
 * @swagger
 * /drives:
 *   post:
 *     summary: Create a new vaccination drive
 *     tags: [VaccinationDrive]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Drive A"
 *             createdBy: "user-uuid"
 *             startDate: "2025-06-01T00:00:00Z"
 *             endDate: "2025-06-10T00:00:00Z"
 *             location: "School A"
 *             targetClasses: ["class-1", "class-2"]
 *             notes: "First drive"
 *             status: "upcoming"
 *             vaccines: ["vaccine-uuid-1"]
 *     responses:
 *       201:
 *         description: Drive created
 */
router.post('/', (req, res) => {
  const driveId = uuidv4();
  const {
    name, createdBy, startDate, endDate,
    location, targetClasses, notes, status, vaccines
  } = req.body;

  const drive = new VaccinationDrive(
    driveId,
    name,
    createdBy,
    new Date(startDate),
    new Date(endDate),
    location,
    targetClasses,
    notes,
    status,
    vaccines.map(v => typeof v === 'object' ? v : getVaccineById(v))
  );

  addDrive(drive);
  res.status(201).json(drive);
});

/**
 * @swagger
 * /drives:
 *   put:
 *     summary: Update a vaccination drive
 *     tags: [VaccinationDrive]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             driveId: "drive-uuid"
 *             name: "Updated Drive"
 *             createdBy: "user-uuid"
 *             startDate: "2025-06-02T00:00:00Z"
 *             endDate: "2025-06-12T00:00:00Z"
 *             location: "Updated School"
 *             targetClasses: ["class-1"]
 *             notes: "Postponed"
 *             status: "ongoing"
 *             vaccines: ["vaccine-uuid-1"]
 *     responses:
 *       200:
 *         description: Drive updated
 */
router.put('/', (req, res) => {
  const {
    driveId, name, createdBy, startDate, endDate,
    location, targetClasses, notes, status, vaccines
  } = req.body;

  const drive = new VaccinationDrive(
    driveId,
    name,
    createdBy,
    new Date(startDate),
    new Date(endDate),
    location,
    targetClasses,
    notes,
    status,
    vaccines.map(v => typeof v === 'object' ? v : getVaccineById(v))
  );

  updateDrive(drive);
  res.json({ message: 'Drive updated successfully' });
});

/**
 * @swagger
 * /drives/{id}:
 *   delete:
 *     summary: Delete a vaccination drive
 *     tags: [VaccinationDrive]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drive deleted
 */
router.delete('/:id', (req, res) => {
  deleteDriveById(req.params.id);
  res.json({ message: 'Drive deleted successfully' });
});

module.exports = router;
