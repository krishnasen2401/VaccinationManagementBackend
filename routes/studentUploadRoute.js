// routes/studentUploadRoute.js
const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Student = require('../models/Student');
const { addStudent } = require('../controllers/studentController');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /students/upload:
 *   post:
 *     summary: Upload a CSV file of students
 *     tags: [Students]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload processed with summary
 */
router.post('/upload', upload.single('file'), (req, res) => {
  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      results.forEach((row, index) => {
        try {
          const studentId = uuidv4();
          const guardians = row.guardians ? JSON.parse(row.guardians) : [];
          const student = new Student(
            studentId,
            row.name,
            row.classId,
            row.StudentID,
            row.dateOfBirth,
            guardians
          );
          addStudent(student);
          successCount++;
        } catch (err) {
          errorCount++;
          errors.push({ row: index + 1, error: err.message });
        }
      });

      fs.unlinkSync(filePath); // Clean up
      res.json({ successCount, errorCount, errors });
    });
});

module.exports = router;
