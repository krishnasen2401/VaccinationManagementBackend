const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const Vaccine = require('../models/Vaccine');
const {
  addVaccine,
  updateVaccine,
  deleteVaccineById,
  getVaccineById,
  getVaccines
} = require('../controllers/vaccineController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Batch:
 *       type: object
 *       properties:
 *         batchId:
 *           type: string
 *         expiryDate:
 *           type: string
 *           format: date
 *         receivedDate:
 *           type: string
 *           format: date
 *     Vaccine:
 *       type: object
 *       required:
 *         - vaccineName
 *       properties:
 *         vaccineId:
 *           type: string
 *           format: uuid
 *         vaccineName:
 *           type: string
 *         manufacturer:
 *           type: string
 *         dosage:
 *           type: string
 *         description:
 *           type: string
 *         storageRequirements:
 *           type: string
 *         batches:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Batch'
 *         dosesPerVial:
 *           type: integer
 *         vaccineType:
 *           type: string
 *         administerBefore:
 *           type: string
 *           format: date
 *         countryOfOrigin:
 *           type: string
 *         packageInsert:
 *           type: string
 *         numberOfVials:
 *           type: integer
 */

/**
 * @swagger
 * /vaccines:
 *   get:
 *     summary: Get all vaccines with optional filters
 *     tags: [Vaccines]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by vaccine name (partial)
 *       - in: query
 *         name: manufacturer
 *         schema:
 *           type: string
 *         description: Filter by manufacturer
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by vaccine type
 *       - in: query
 *         name: batchId
 *         schema:
 *           type: string
 *         description: Filter by batch ID inside JSON
 *     responses:
 *       200:
 *         description: List of vaccines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vaccine'
 */
router.get('/', (req, res) => {
  const { name, manufacturer, type, batchId } = req.query;
  const vaccines = getVaccines({ name, manufacturer, type, batchId });
  res.json(vaccines);
});

/**
 * @swagger
 * /vaccines/{id}:
 *   get:
 *     summary: Get a vaccine by ID
 *     tags: [Vaccines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vaccine found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vaccine'
 *       404:
 *         description: Vaccine not found
 */
router.get('/:id', (req, res) => {
  const vaccine = getVaccineById(req.params.id);
  vaccine
    ? res.json(vaccine)
    : res.status(404).json({ message: 'Vaccine not found' });
});

/**
 * @swagger
 * /vaccines:
 *   post:
 *     summary: Add a new vaccine
 *     tags: [Vaccines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             vaccineName: "Hepatitis B"
 *             manufacturer: "XYZ Pharma"
 *             dosage: "0.5ml"
 *             description: "Preventive vaccine for Hepatitis B"
 *             storageRequirements: "2-8C"
 *             batches:
 *               - batchId: "HBV-123"
 *                 expiryDate: "2026-03-01"
 *                 receivedDate: "2024-04-01"
 *             dosesPerVial: 5
 *             vaccineType: "Injection"
 *             administerBefore: "2026-03-31"
 *             countryOfOrigin: "India"
 *             packageInsert: "See leaflet"
 *             numberOfVials: 100
 *     responses:
 *       201:
 *         description: Vaccine created
 */
router.post('/', (req, res) => {
  const vaccineId = uuidv4();
  const {
    vaccineName, manufacturer, dosage, description,
    storageRequirements, batches, dosesPerVial, vaccineType,
    administerBefore, countryOfOrigin, packageInsert, numberOfVials
  } = req.body;
  const vaccine = new Vaccine(
    vaccineId, vaccineName, manufacturer, dosage, description,
    storageRequirements, batches, dosesPerVial, vaccineType,
    administerBefore, countryOfOrigin, packageInsert, numberOfVials
  );
  addVaccine(vaccine);
  res.status(201).json(vaccine);
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
 *             batchId: "batch-123"
 *             notes: "Follow-up required"
 *     responses:
 *       200:
 *         description: Record updated
 */

router.put('/', (req, res) => {
  const {
    vaccineId, vaccineName, manufacturer, dosage, description,
    storageRequirements, batches, dosesPerVial, vaccineType,
    administerBefore, countryOfOrigin, packageInsert, numberOfVials
  } = req.body;
  const vaccine = new Vaccine(
    vaccineId, vaccineName, manufacturer, dosage, description,
    storageRequirements, batches, dosesPerVial, vaccineType,
    administerBefore, countryOfOrigin, packageInsert, numberOfVials
  );
  updateVaccine(vaccine);
  res.json({ message: 'Vaccine updated successfully' });
});

/**
 * @swagger
 * /vaccines/{id}:
 *   delete:
 *     summary: Delete a vaccine by ID
 *     tags: [Vaccines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vaccine deleted
 */
router.delete('/:id', (req, res) => {
  deleteVaccineById(req.params.id);
  res.json({ message: 'Vaccine deleted successfully' });
});

module.exports = router;
