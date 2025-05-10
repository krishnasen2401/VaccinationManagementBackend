const Users = require('../models/Users');
const db = require('../database/db');

const login = (username, password) => {
  const stmt = db.prepare(`SELECT * FROM users WHERE username = ? AND password = ?`);
  const userRow = stmt.get(username, password);

  if (!userRow) return null;

  const user = Users.fromSQLiteRow(userRow);
  return {
    token: user.token, // return existing token
    user: {
      userId: user.userId,
      username: user.username,
      roles: user.roles,
    },
  };
};

module.exports = { login };
