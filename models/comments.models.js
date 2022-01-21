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

exports.selectComments = () => {
    return db.query(
        `SELECT *
        FROM comments;`
    ).then((result) => {
        const comments = result.rows;
        return comments;
    });
}

exports.removeComment = (comment_id) => {
    return db.query(
        `DELETE from comments
        WHERE comment_id = $1`, [comment_id]
    ).then((result) => {
        return result.rows;
    });
}

exports.selectComment = (comment_id) => {
    return db.query(
        `SELECT *
        FROM comments
        WHERE comment_id = $1;`, [comment_id]
    ).then((result) => {
        const comment = result.rows[0];
        return comment;
    });
}