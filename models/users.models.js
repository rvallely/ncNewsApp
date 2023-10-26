const db = require('../db/connection.js');

exports.selectSingleUser = async (username) => {
    return [{ rows }] = await db.query(
        `
        SELECT * FROM users
        WHERE username = $1;
        `,
        [username]
    );
}

exports.insertUser = async ({ email, username, avatarIcon }, hash) => {
    return [{ rows }] = await db.query(
        `
        INSERT INTO users 
        (email, username, avatar_url, password)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *;
        `,
        [email, username, avatarIcon, hash],
    );
}
