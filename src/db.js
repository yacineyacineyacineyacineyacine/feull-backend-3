import Database from 'better-sqlite3';

const db = new Database(process.env.DB_NAME);
db.pragma('journal_mode = WAL');
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
    `).run();
db.prepare(`
     CREATE TABLE IF NOT EXISTS todos(
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id INTEGER,
     task TEXT,
     completed BOOLEAN DEFAULT 0,
     FOREIGN KEY(user_id) REFERENCES users(id)
     )
    `).run();
    

export default db;