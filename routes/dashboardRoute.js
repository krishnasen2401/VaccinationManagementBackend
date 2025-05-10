const express = require('express');
const { getAllStudents } = require('../controllers/studentController');
const { getRecords } = require('../controllers/vaccinationRecordController');
const { getAllDrives } = require('../controllers/vaccinationDriveController');

const router = express.Router();

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get summary statistics for dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard data including total students, vaccinated count, and upcoming drives
 *         content:
 *           application/json:
 *             example:
 *               totalStudents: 120
 *               vaccinatedStudents: 110
 *               percentVaccinated: 91.67
 *               upcomingDrives: 3
 */
router.get('/summary', (req, res) => {
  const students = getAllStudents();
  const records = getRecords();
  const drives = getAllDrives({ status: 'upcoming' });

  const studentIds = new Set(students.map(s => s.studentId));
  const vaccinatedStudentIds = new Set(
    records.map(r => r.studentId).filter(id => studentIds.has(id))
  );

  const totalStudents = students.length;
  const vaccinatedStudents = vaccinatedStudentIds.size;
  const percentVaccinated = totalStudents > 0
    ? ((vaccinatedStudents / totalStudents) * 100).toFixed(2)
    : 0;

  res.json({
    totalStudents,
    vaccinatedStudents,
    percentVaccinated: Number(percentVaccinated),
    upcomingDrives: drives.length
  });
});

module.exports = router;
