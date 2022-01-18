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
/*     return db.query(`SELECT * FROM treasures ORDER BY ${order_by_column} ASC;`)
        .then(result => {
            //console.log(result.rows, '<<<ROWS');
            const treasures = result.rows;
            return treasures;
        });    */