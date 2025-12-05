// lib/db.js - BULLETPROOF SINGLETON
let db = null;

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
};

const initDB = (database) => {
  db = database;
  console.log('✅ DB singleton initialized. db.all:', typeof db.all);
};

module.exports = { getDB, initDB };
