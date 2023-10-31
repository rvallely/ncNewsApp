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

exports.updateArticle = async (id, { votes, body, title, topic }) => {
    let setStatement = 'SET '
    const params = [id];

    if (body) {
        setStatement += `body = $${params.length + 1},`;
        params.push(body);
    }
    if (votes) {
        setStatement += `votes = $${params.length + 1},`;
        params.push(votes);
    }
    if (title) {
        setStatement += `title = $${params.length + 1},`;
        params.push(title);
    }
    if (topic) {
        setStatement += `topic = $${params.length + 1},`;
        params.push(topic);
    }
    // remove the trailing comma
    setStatement = setStatement.slice(0, -1);

    const { rows: [article] } = await db.query(
        `UPDATE articles
        ${setStatement}
        WHERE id = $1
        RETURNING *;`,
        params,
        );
    return article;
}

exports.deleteArticle = async (id) => {
    try {
        const result = await db.query(
            `
            DELETE FROM articles
            WHERE id = $1;
            `, [id]
        );
        return { success: true };
    } catch (err) {
        return { success: false };
    }
}
