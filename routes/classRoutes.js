const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const {
  addClass,
  updateClass,
  deleteClassById,
  getClassById,
  getAllClasses,
} = require('../controllers/classController');
const SchoolClass = require('../models/SchoolClass');

/**
 * @swagger
 * components:
 *   schemas:
 *     SchoolClass:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         classId:
 *           type: string
 *           format: uuid
 *           description: Auto-generated class ID
 *           example: "4b4a822b-bf71-4a7d-9f13-13340f45eac5"
 *         name:
 *           type: string
 *           example: "10"
 *         section:
 *           type: string
 *           example: "A"
 */

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Get all classes or filter by name/section
 *     tags: [Classes]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Partial match on class name
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *         description: Exact match on section
 *     responses:
 *       200:
 *         description: List of matching classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SchoolClass'
 */
router.get('/', (req, res) => {
  const { name, section } = req.query;
  const classes = getAllClasses({ name, section });
  console.log(classes);
  res.json(classes);
});

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Get a class by its UUID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Class found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchoolClass'
 *       404:
 *         description: Class not found
 */
router.get('/:id', (req, res) => {
  const schoolClass = getClassById(req.params.id);
  schoolClass
    ? res.json(schoolClass)
    : res.status(404).json({ message: 'Class not found' });
});

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Create a new class (UUID auto-generated)
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "12"
 *             section: "C"
 *     responses:
 *       201:
 *         description: Class created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchoolClass'
 */
router.post('/', (req, res) => {
  const classId = uuidv4();
  const { name, section } = req.body;
  const schoolClass = new SchoolClass(classId, name, section);
  addClass(schoolClass);
  res.status(201).json(schoolClass);
});

/**
 * @swagger
 * /classes:
 *   put:
 *     summary: Update an existing class
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             classId: "4b4a822b-bf71-4a7d-9f13-13340f45eac5"
 *             name: "11"
 *             section: "B"
 *     responses:
 *       200:
 *         description: Class updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Class updated successfully
 */
router.put('/', (req, res) => {
  const { classId, name, section } = req.body;
  const schoolClass = new SchoolClass(classId, name, section);
  updateClass(schoolClass);
  res.json({ message: 'Class updated successfully' });
});

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Delete a class by ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Class deleted successfully
 */
router.delete('/:id', (req, res) => {
  deleteClassById(req.params.id);
  res.json({ message: 'Class deleted successfully' });
});

module.exports = router;
