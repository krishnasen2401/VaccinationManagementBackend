// routes/userRoutes.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Users = require('../models/Users');
const {
  addUser,
  updateUser,
  deleteUserById,
  getUserById,
  getAllUsers
} = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         token:
 *           type: string
 *         contact:
 *           type: string
 *         roles:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', (req, res) => {
  const users = getAllUsers(req.query);
  res.json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: Not found
 */
router.get('/:id', (req, res) => {
  const user = getUserById(req.params.id);
  user
    ? res.json(user)
    : res.status(404).json({ message: 'User not found' });
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: "admin"
 *             password: "securepass"
 *             contact: "1234567890"
 *             roles: ["admin"]
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/', (req, res) => {
  const { username, password, token, contact, roles } = req.body;
  const userId = uuidv4();
  const user = new Users(userId, username, password, token || '', contact || '', roles || []);
  addUser(user);
  res.status(201).json(user);
});

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "user-uuid"
 *             username: "admin"
 *             password: "newpass"
 *             contact: "9876543210"
 *             roles: ["admin"]
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/', (req, res) => {
  const { userId, username, password, token, contact, roles } = req.body;
  const user = new Users(userId, username, password, token || '', contact || '', roles || []);
  updateUser(user);
  res.json({ message: 'User updated successfully' });
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:id', (req, res) => {
  deleteUserById(req.params.id);
  res.json({ message: 'User deleted successfully' });
});

module.exports = router;