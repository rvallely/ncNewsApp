const db = require('../db/connection.js');
const { buildArticlesOrCommentsQuery } = require('../utils/utils.js');

exports.selectArticles = async (query) => {
    const subType = query.hasOwnProperty('id') ? 'single article': '';

    const {
        statement,
        params,
    } = buildArticlesOrCommentsQuery(
        query,
        {
            type: 'articles',
            subType,
        }
        );

    const { rows: currentPageArticles } = await db.query(
        statement.currentPage,
        params
    )

    const response = {
        articles: currentPageArticles,
    }
    if (subType === '') {
        const { rows: nextPageArticles } = await db.query(
            statement.nextPage,
            params
        );

        response.lastPage = nextPageArticles.length === 0;
    }
    return response;
}

exports.insertArticle = async ({ author, title, body, topic}) => {
    const { rows: [article] } = await db.query(
        `
        INSERT INTO articles
        (author, title, body, topic)
        VALUES 
        ($1, $2, $3, $4)
        RETURNING *;
        `,
        [author, title, body, topic],
    );
    return article;
}

exports.updateArticle = async (id, { votes, body}) => {
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
    const { rows: [article] } = await db.query(
        `UPDATE articles
        ${setStatement}
        WHERE id = $1
        RETURNING *;`,
        params,
        );
    return article;
}






















exports.removeArticle = (articleId, deletedValues) => {
    return db.query(
        `UPDATE articles
        SET title = $2, body = $3, votes = $4
        WHERE id = $1
        RETURNING *;`, [articleId, deletedValues.title, deletedValues.body, deletedValues.votes]
    ).then((result) => {
        return result.rows[0];
    });
}
