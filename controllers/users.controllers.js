const { selectUsers, selectSingleUser, insertNewUser } = require('../models/users.models.js');
const { checkUserExists, checkUsernameValid, checkPasswordCorrect } = require('../utils/utils.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getUsers = (req, res, next) => {
    return selectUsers().then((users) => {
        res.status(200).send({ users: users });
    })
    .catch((err) => {
        next(err);
    });
}

exports.getSingleUser = async (req, res, next) => {
    const { username, password } = req.body;
    const usernameValid = checkUsernameValid(username);
    if (usernameValid === 'chars over 30') {
        return Promise.reject({ status: 400, msg: 'Bad Request: Username cannot exceed 30 characters.' })
        .catch((err) => {
            next(err);
        });
    } 
    else if (usernameValid === true) {
        return selectSingleUser(username, password).then((user) => {
            if (user !== false) {
                bcrypt.compare(password, user.password, (err, passCorrect) => {
                    if (passCorrect) {
                        res.status(200).send({ user });
                    } else {
                        return Promise.reject({ status: 400, msg: 'Bad Request: Incorrect password.' })
                        .catch((err) => {
                            next(err);
                        });
                    }

                }) 
            } else {
                return Promise.reject({ status: 404, msg: 'Not Found: user not on database'})
                .catch((err) => {
                    next(err);
                });
            }
        });
    }
}

exports.postNewUser = (req, res, next) => {
    const newUser = req.body;
    return checkUserExists(newUser.username).then((userExists) => {
        if (userExists) {
            return Promise.reject({ status: 400, msg: 'Bad Request: user already exists' })
            .catch((err) => {
                next(err);
            });
        } 
        else if (!userExists) {
            bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
                if (err) {
                    res.send({ err: err }); 
                } else {
                    return insertNewUser(newUser, hash).then((postedUser) => {
                        res.status(201).send({ postedUser });
                    })
                }
            });
        }
    });
}

