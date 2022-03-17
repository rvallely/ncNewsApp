const db = require('../db/connection.js');

exports.selectUsers = () => {
    return db.query(`SELECT username FROM users;`)
    .then((result) => {
        const users = result.rows
        return users;
    });
}

exports.selectSingleUser = (username) => {
    return db.query(
        `SELECT * FROM users
        WHERE username = $1;`, [username])
    .then((result) => {
        console.log('single user ', result.rows[0])
        const user = result.rows[0];
        return user;
    });
}