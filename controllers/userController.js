const Users = require('../models/Users');
const db = require('../database/db');

const addUser = (user) => {
  const stmt = db.prepare(`
    INSERT INTO users (user_id, username, password, token, contact, roles)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    user.userId,
    user.username,
    user.password,
    user.token,
    user.contact,
    JSON.stringify(user.roles)
  );
};

const updateUser = (user) => {
  const stmt = db.prepare(`
    UPDATE users
    SET username = ?, password = ?, token = ?, contact = ?, roles = ?
    WHERE user_id = ?
  `);
  stmt.run(
    user.username,
    user.password,
    user.token,
    user.contact,
    JSON.stringify(user.roles),
    user.userId
  );
};

const deleteUserById = (userId) => {
  const stmt = db.prepare(`DELETE FROM users WHERE user_id = ?`);
  stmt.run(userId);
};

const getUserById = (userId) => {
  const stmt = db.prepare(`SELECT user_id,username,contact,roles FROM users WHERE user_id = ?`);
  const row = stmt.get(userId);
  return row ? Users.fromSQLiteRow(row) : null;
};

const getUsers = (filters = {}) => {
  const { username, contact, role } = filters;

  let query = `SELECT user_id,username,contact,roles FROM users WHERE 1=1`;
  const params = [];

  if (username) {
    query += ` AND username LIKE ?`;
    params.push(`%${username}%`);
  }

  if (contact) {
    query += ` AND contact LIKE ?`;
    params.push(`%${contact}%`);
  }

  if (role) {
    query += ` AND EXISTS (
      SELECT 1 FROM json_each(roles)
      WHERE json_each.value = ?
    )`;
    params.push(role);
  }

  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  return rows.map(row => Users.fromSQLiteRow(row));
};

module.exports = {
  addUser,
  updateUser,
  deleteUserById,
  getUserById,
  getUsers
};
