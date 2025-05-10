const Database = require('better-sqlite3');

const db = new Database('./database/vaccination_data.db', { verbose: console.log });
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

module.exports = db;
