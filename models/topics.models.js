const db = require('../db/connection.js')

exports.selectTopics = async () => {
    return { rows } = await db.query(
        `
        SELECT *
        FROM topics;
        `
    );
}

