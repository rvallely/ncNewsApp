const { selectSingleUser, insertUser } = require('../models/users.models.js');
const { checkUserExists } = require('../utils/utils.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getSingleUser = async (req, res, next) => {
    const { username, password } = req.query;

    const user = await selectSingleUser(username);
        if (user) {
            bcrypt.compare(password, user.password, (err, passCorrect) => {
                if (err) {
                    next(err);
                }
                if (passCorrect) {
                    res.status(200).send({ user });
                } else {
                    next({ status: 400, msg: 'Incorrect password. Please try again.' });
                }
            });
        } else {
            next({ status: 404, msg: 'User not found. Please try again.'});
        }
}

exports.postUser = async (req, res, next) => {
    const userExists = await checkUserExists(req.body.username);
    if (userExists) {
        next({ status: 400, msg: 'User already exists, please log in.' });
    } else {
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err) {
                next(err);
            } else {
                const user = insertUser(req.body, hash);
                res.status(201).send({ user });
            }
        });
    }
}
