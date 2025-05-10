const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Simulated user login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: "admin1"
 *             password: "securepass"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               token: "xyz-token"
 *               user:
 *                 userId: "uuid"
 *                 username: "admin1"
 *                 roles: ["admin"]
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const result = login(username, password);

  if (!result) {
    res.status(401).json({ message: 'Invalid credentials' });
  } else {
    res.json(result);
  }
});

module.exports = router;
