const pool = require("./db");

const createPostTable = async ()=>{
    await pool.query(`
        create table if not exists posts(
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT fk_user
                FOREIGN KEY(user_id)
                REFERENCES users(id)
                ON DELETE CASCADE
        );
    `);
};

module.exports = {
    createPostTable
};