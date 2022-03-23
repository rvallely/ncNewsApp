const res = require('express/lib/response');
const db = require('../db/connection.js');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

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
        WHERE username = $1;`, [username])
    .then((result) => {
        if (result.rows.length > 0){
            bcrypt.compare(password, result.rows[0].password, (error, correctPassword))
                if (correctPassword) {
                    return result.rows[0];
                } else {
                    res.send({ status: 400 , msg: 'Bad Request: incorrect password.' })
                }      
        } 
        else {
           res.send({ status: 404, msg: 'Not Found: user not on database.'})
        }
    });
}

exports.insertNewUser = (newUser, hash) => {
    return db.query(
        `INSERT INTO users 
        (name, username, avatar_url, password)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *;`, [newUser.name, newUser.username, newUser.avatar_url, hash]
        )
        .then((result) => {
            const postedUser = result.rows[0];
            return postedUser;
        });
}