const { selectUsers, selectSingleUser } = require('../models/users.models.js');
const { checkUserExists, checkUsernameValid } = require('../utils/utils.js');

exports.getUsers = (req, res, next) => {
    return selectUsers().then((users) => {
        res.status(200).send({ users: users });
    })
    .catch((err) => {
        next(err);
    });
}

exports.getSingleUser = (req, res, next) => {
    const username = req.params.username;
    const usernameValid = checkUsernameValid(username);
    const { password } = req.body;
    console.log(password, '<< in controler');
    if (usernameValid === true) {
        return checkUserExists(username).then((userExists) => {
            if (userExists) {
                return selectSingleUser(username, password).then((user) => {
                    res.status(200).send({ user: user });
                })
            } else {
                return Promise.reject({ status: 404, msg: 'Not Found: user not on database' })
                .catch((err) => {
                    next(err);
                });
            }
        });
    } 
    else if (usernameValid === 'chars over 30') {
        return Promise.reject({ status: 400, msg: 'Bad Request: Username cannot exceed 30 characters.' })
        .catch((err) => {
            next(err);
        });
    }
}

