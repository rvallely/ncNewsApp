const { selectUsers, selectSingleUser } = require('../models/users.models.js');
const { checkUserExists } = require('../utils/utils.js');

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
    return checkUserExists(username).then((userExists) => {
        if(userExists) {
            return selectSingleUser(username).then((user) => {
                res.status(200).send({ user: user });
            })
        } else {
            return Promise.reject({ status: 404, msg: 'Not Found' });
        }
    })
    
    .catch((err) => {
        next(err);
    });
}

