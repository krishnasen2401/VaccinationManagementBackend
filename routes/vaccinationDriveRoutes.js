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

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     VaccinationDrive:
 *       type: object
 *       required:
 *         - name
 *         - startDate
 *         - endDate
 *         - vaccines
 *       properties:
 *         driveId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         createdBy:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         location:
 *           type: string
 *         targetClasses:
 *           type: array
 *           items:
 *             type: string
 *         notes:
 *           type: string
 *         status:
 *           type: string
 *         vaccines:
 *           type: array
 *           items:
 *             type: string
 *           description: List of vaccine IDs
 */

/**
 * @swagger
 * /drives:
 *   get:
 *     summary: Get all vaccination drives with filters
 *     tags: [VaccinationDrive]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, ongoing, completed]
 *       - in: query
 *         name: targetClass
 *         schema:
 *           type: string
 *       - in: query
 *         name: vaccineName
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of drives
 */
router.get('/', (req, res) => {
  const drives = getAllDrives(req.query);
  res.json(drives);
});

/**
 * @swagger
 * /drives/{id}:
 *   get:
 *     summary: Get drive by ID
 *     tags: [VaccinationDrive]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vaccination drive with full vaccine details
 *       404:
 *         description: Not found
 */
router.get('/:id', (req, res) => {
  const drive = getDriveById(req.params.id);
  drive
    ? res.json(drive)
    : res.status(404).json({ message: 'Drive not found' });
});

/**
 * @swagger
 * /drives:
 *   post:
 *     summary: Create new vaccination drive
 *     tags: [VaccinationDrive]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:{
 *             name: "Hepatitis Drive"
 *             createdBy: "user-uuid"
 *             startDate: "2025-09-01"
 *             endDate: "2025-09-15"
 *             location: "Main Hall"
 *             targetClasses: ["class-1", "class-2"]
 *             notes: "Ensure consent forms collected"
 *             status: "upcoming"
 *             vaccines: ["vaccine-id-1", "vaccine-id-2"]
 *          }
 *     responses:
 *       201:
 *         description: Drive created
 */
router.post('/', (req, res) => {
  const {
    name, createdBy, startDate, endDate,
    location, targetClasses, notes, status, vaccines
  } = req.body;
  const driveId = uuidv4();
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
    vaccines
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
 *           example:{
 *             driveId: "drive-uuid"
 *             name: "Updated Name"
 *             createdBy: "user-uuid"
 *             startDate: "2025-09-01"
 *             endDate: "2025-09-20"
 *             location: "New Location"
 *             targetClasses: ["class-3"]
 *             notes: "Drive changed"
 *             status: "ongoing"
 *             vaccines: ["vaccine-id-1"]
 *            }
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
    vaccines
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
