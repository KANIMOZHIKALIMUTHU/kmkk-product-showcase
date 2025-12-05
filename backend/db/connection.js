// db/connection.js - FORCE GLOBAL DB
module.exports = global.db || require('../index');
