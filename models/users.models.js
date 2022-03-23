const res = require('express/lib/response');
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
        if (result.rows.length > 0){
            return result.rows[0];
        } 
        else {
           res.send({ status: 400 , msg: 'Bad Request: incorrect password.'})
        }
    });
}

exports.insertNewUser = (newUser) => {
    return db.query(
        `INSERT INTO users 
        (name, username, avatar_url, password)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *;`, [newUser.name, newUser.username, newUser.avatar_url, newUser.password]
    )
    .then((result) => {
        const postedUser = result.rows[0];
        console.log(postedUser)
        return postedUser;
    })
}