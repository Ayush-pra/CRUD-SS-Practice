const pool = require("./db");

const createUserTable = async () => {
    await pool.query(`
        create table if not exists users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE,
            name VARCHAR(100),
            age INTEGER,
            email VARCHAR(100) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            profilepic TEXT DEFAULT 'default.png',
            bio_content TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

module.exports = {
    createUserTable
};
