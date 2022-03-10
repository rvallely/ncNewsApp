const { selectUsers, selectSingleUser } = require('../models/users.models.js');

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
    return selectSingleUser(username).then((user) => {
        res.status(200).send({ user: user });
    })
    .catch((err) => {
        next(err);
    });
}