const { patch } = require('../app.js');
const db = require('../db/connection.js');
const { buildArticlesOrCommentsQuery } = require('../utils/utils.js');

exports.selectComments = async (query) => {
    const {
        statement,
        params,
    } = buildArticlesOrCommentsQuery(
        query,
        {
            type: 'comments',
            subType: '',
        }
        );

    const { rows: currentPageComments } = await db.query(
        statement.currentPage,
        params
    )

    const { rows: nextPageComments } = await db.query(
        statement.nextPage,
        params
    )

    return {
        comments: currentPageComments,
        lastPage: nextPageComments.length === 0,
    }
}

exports.insertComment = async (articleId, { body, username }) => {
    return [{ rows }] = await db.query(
        `
        INSERT INTO comments
        (author, article_id, body)
        VALUES 
        ($1, $2, $3)
        RETURNING *;
        `,
        [username, articleId, body],
    );
}
























exports.removeComment = async (id) => {
    const result = await db.query(
        `DELETE from comments
        WHERE id = $1`, [id]
    );
    return result.rows;
}

exports.selectComment = async (id) => {
    const result = await db.query(
        `SELECT *
        FROM comments
        WHERE id = $1;`, [id]
    );
    const comment = result.rows[0];
    return comment;
}

exports.updateComment = async (id, { votes, body}) => {
    let setStatement = ''
    const params = [id];

    if (body) {
        setStatement += `SET body = $2`;
        params.push(body);
    }
    if (votes) {
        setStatement += `SET votes = $2`;
        params.push(votes);
    }

    const result = await db.query(
        `UPDATE comments
        ${setStatement}
        WHERE id = $1
        RETURNING *;`, params);
    return result.rows[0];
}

