const db = require('../db/connection.js');

exports.selectUsers = () => {
    return db.query(`SELECT username FROM users;`)
    .then((result) => {
        const users = result.rows
        return users;
    });
}

exports.selectSingleUser = (username, password) => {
    return db.query(
        `SELECT * FROM users
        WHERE username = $1 AND password = $2;`, [username, password])
    .then((result) => {
        console.log(result.rows)
        const user = result.rows[0];
        if (user.length === 0) {
            return Promise.reject({ status: 400 , msg: 'Bad Request: incorrect password'})
        } else {
            return user;
        }
    });
}