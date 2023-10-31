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
    const { rows: [comment] } = await db.query(
        `
        INSERT INTO comments
        (author, article_id, body)
        VALUES 
        ($1, $2, $3)
        RETURNING *;
        `,
        [username, articleId, body],
    );
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

exports.deleteComments = async ({ id, articleId }) => {
    const where = {
        statement: 'WHERE ',
        params: [],
    }
    if (id) {
        where.statement += ' id=$1;';
        where.params.push(id);
    }
    if (articleId) {
        where.statement += ' article_id=$1;';
        where.params.push(articleId);
    }
    try {
        await db.query(
            `
            DELETE from comments
            ${where.statement}
            `,
            where.params,
        );
        return { success: true };
    } catch (err) {
        return { success: false };
    }
}
