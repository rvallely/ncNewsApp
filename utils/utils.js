const db = require('../db/connection.js');

exports.checkColumnExists = (sortBy) => {
    return ['author', 'title', 'topic', 'created_at', 'votes', 'comment_count'].includes(sortBy);
}

exports.checkUserExists = async (username) => {
    const result = await db.query(
        `
        SELECT * FROM users
        WHERE username = $1;
        `,
        [username],
        );
    return result.rows.length > 0;
}

exports.commentOrArticleUpdateBodyValid = (body) => {
    return body.hasOwnProperty('body') || body.hasOwnProperty('votes');
}

exports.articleExists = async (id) => {
    const result = await db.query(
        `
        SELECT * FROM articles
        WHERE id = $1;
        `,
        [id],
    );
    return result.rows.length > 0;
}

exports.buildArticlesOrCommentsQuery = (query, { type, subType }) => {
    const statements = {
        comments: {
            select: 'SELECT *\n',
            from: 'FROM comments\n',
        },
        articles: {
            select: `
            SELECT
                articles.author,
                articles.title,
                articles.body,
                articles.id,
                articles.topic,
                articles.created_at,
                articles.votes,
                COUNT(comments.article_id) AS comment_count
            `,
            from: `
            FROM articles
            LEFT JOIN comments
            ON comments.article_id = articles.id\n` ,
            groupBy: `GROUP BY articles.id\n`,
        },
    }
    const where = {
        statement: '',
        params: []
    }

    let order = '';

    Object.entries(query).forEach(([key, value]) => {
        const keyPrefix = type === 'articles' ? 'articles.' : ''
        switch (key) {
            case 'topic':
                if (where.params.length === 0) {
                    where.statement += ` WHERE ${keyPrefix}${key}=$1 `;
                    where.params.push(value)
                } else {
                    where.statement += `AND ${keyPrefix}${key}=$${where.params.length + 1} `;
                    where.params.push(value)
                }
                break;
            case 'author':
                if (where.params.length === 0) {
                    where.statement += ` WHERE ${keyPrefix}${key} = $1 `;
                    where.params.push(value)
                } else {
                    where.statement += ` AND ${keyPrefix}${key} = $${where.params.length + 1} `;
                    where.params.push(value)
                }
                break;
            case 'sortBy':
                order += `ORDER BY ${query.sortBy} ${query.order} `
                break;
            case 'id':
                if (where.params.length === 0) {
                    where.statement += ` WHERE articles.${key} = $1 `;
                    where.params.push(value)
                } else {
                    where.statement += ` AND articles.${key} = $${where.params.length + 1} `;
                    where.params.push(value)
                }
                break;
            case 'articleId':
                if (where.params.length === 0) {
                    where.statement += ` WHERE article_id = $1 `;
                    where.params.push(value)
                } else {
                    where.statement += ` AND article_id = $${where.params.length + 1} `;
                    where.params.push(value)
                }
                break;
        }
    });

    if (order === '' && subType !== 'single article') {
        order += 'ORDER BY created_at DESC'
    }

    const basicStatement = {
        articles: statements.articles.select  + statements.articles.from + where.statement + statements.articles.groupBy + order,
        comments: statements.comments.select  + statements.comments.from + where.statement + order,
    }
    return {
        statement: {
            currentPage: basicStatement[type] + (subType === 'single article' ? '': ` LIMIT 30 OFFSET ${Number(query.page) * 30}` + ';'),
            nextPage: basicStatement[type] + (subType === 'single article' ? '': ` LIMIT 30 OFFSET ${(Number(query.page) + 1) * 30}` + ';'),
        },
        params: where.params,
    };
}

exports.commentExists = async (id) => {
    const result = await db.query(
        `
        SELECT *
        FROM comments
        WHERE id = $1;
        `,
        [id]
        );
    return result.rows.length > 0;
}
