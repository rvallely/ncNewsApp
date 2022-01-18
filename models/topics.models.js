const db = require('../db/connection.js')

exports.selectTopics = () => {
    //console.log('in the topics model')
    return db.query(`SELECT * FROM topics;`)
    .then((result) => {
        const topics = result.rows
        //console.log(topics, '<<<topics array');
        return topics;
    });
}
