const db = require('../db/connection.js');

exports.insertComment = (article_id, newComment) => {
    const body = newComment.body
    const author = newComment.username
    
    return db.query(
        `INSERT INTO comments
        (author, article_id, body)
        VALUES 
        ($1, $2, $3)
        RETURNING *;`, [author, article_id, body]
    ).then((result) => {
        const newComment = result.rows;
        return newComment[0];
    });
}
// would need to adapt and insert into users and potentially other tables before being able to insert(post)
// a new comment in comments if the author was a new author (because if author is not in users this violates the foreign key constraint of comments_author users(username)) 

exports.selectComments = () => {
    console.log('inside comment mod')
    return db.query(
        `SELECT *
        FROM comments;`
    ).then((result) => {
        const comments = result.rows;
        return comments;
    });
}