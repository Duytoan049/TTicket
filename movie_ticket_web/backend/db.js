const dotenv = require('dotenv');
const knex = require('knex');

// Load biến môi trường từ file .env
dotenv.config();

// Tạo kết nối đến MySQL
const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    },
});

// Xuất kết nối
module.exports = db;
