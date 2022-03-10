const db = require('../db/connection.js')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then((result) => {
        const topics = result.rows
        return topics;
    });
}
