const Database = require('better-sqlite3');
const db = new Database('./database/vaccination_data.db');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  const stmt = db.prepare(`SELECT * FROM users WHERE token = ?`);
  const user = stmt.get(token);

  if (!user) {
    return res.status(403).json({ message: 'Unauthorized token' });
  }

  req.user = user; // optionally store user info in req
  next();
};

module.exports = { requireAuth };
