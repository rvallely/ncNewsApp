const { selectUsers } = require('../models/users.models.js');

exports.getUsers = (req, res, next) => {
    return selectUsers().then((users) => {
        res.status(200).send({ users: users });
    })
    .catch((err) => {
        next(err);
    });
}