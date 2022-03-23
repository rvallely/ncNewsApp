const { selectUsers, selectSingleUser, insertNewUser } = require('../models/users.models.js');
const { checkUserExists, checkUsernameValid, checkPasswordCorrect } = require('../utils/utils.js');

exports.getUsers = (req, res, next) => {
    return selectUsers().then((users) => {
        res.status(200).send({ users: users });
    })
    .catch((err) => {
        next(err);
    });
}

exports.getSingleUser = (req, res, next) => {
    const { username, password } = req.body;
    const usernameValid = checkUsernameValid(username);
    if (usernameValid === true) {
        return checkUserExists(username).then((userExists) => {
            if (userExists) {
                return checkPasswordCorrect(username, password).then((passwordCorrect) => {
                    if (passwordCorrect) {
                        return selectSingleUser(username, password).then((user) => {
                            res.status(200).send({ user: user });
                        });
                    } else {
                        return Promise.reject({ status: 400 , msg: 'Bad Request: incorrect password.'})
                            .catch((err) => {
                                next(err);
                            });
                    }
                });
                
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

exports.postNewUser = (req, res, next) => {
    const newUser = req.body;
    console.log(newUser)
    return checkUserExists(newUser.username).then((userExists) => {
        if (userExists) {
            return Promise.reject({ status: 400, msg: 'Bad Request: user already exists' })
            .catch((err) => {
                next(err);
            });
            // return insertNewUser(newUser).then((postedUser) => {
            //     res.status(201).send({ postedUser });
            // })
        } 
        else if (!userExist) {
             return insertNewUser(newUser).then((postedUser) => {
                res.status(201).send({ postedUser });
            })
            // return Promise.reject({ status: 400, msg: 'Bad Request: user already exists' })
            // .catch((err) => {
            //     next(err);
            // });
        }
    // if username not in database
    });
}

