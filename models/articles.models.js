const db = require('../db/connection.js');

exports.selectArticleById = (article_id) => {
    return db.query(
        `SELECT * 
        FROM articles
        WHERE article_id=$1;`, [article_id]
    )
    .then((result) => {
        const article = result.rows[0];
        return db.query(
            `SELECT * FROM comments
            WHERE article_id=$1;`, [article_id])
        .then((result) => {
            const comment_count = result.rows.length;
            article.comment_count = comment_count;
            return article;
        }); 
    });
}

exports.updateArticle = (article_id, increaseVotesBy) => {
    return db.query(
        `UPDATE articles
        SET votes = votes + $2
        WHERE article_id = $1
        RETURNING *;`, [article_id, increaseVotesBy])
        .then((result) => {
            const updatedArticle = result.rows[0];
            return updatedArticle;
        });
}

exports.selectArticles = (query) => {
    return db.query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY articles.article_id;`
    ).then((result) => {
      let articles = result.rows;

      articles.forEach((article) => {
          article.comment_count = Number(article.comment_count)
      });
      
      let sort_by = '';
      let order = '';

      if (query.hasOwnProperty('sort_by') === false) {
          sort_by = 'created_at';
      } else {
          sort_by = query.sort_by;
      }
      if (query.hasOwnProperty('order') === false) {
          order = 'DESC';
      } else {
          order = query.order;
      }

      if (order === 'DESC') {
        articles.sort(function(a, b) {
          if(a[sort_by] > b[sort_by]) {
              return -1;
          }
          if(a[sort_by] < b[sort_by]) {
              return 1;
          }
          else {
              return 0;
          }
      
      });
    } else if (order === 'ASC') {
        articles.sort(function(a, b) {
          if(a[sort_by] < b[sort_by]) {
              return -1;
          }
          if(a[sort_by] > b[sort_by]) {
              return 1;
          }
          else {
              return 0;
          }
      });
    }

    if (query.topic !== undefined) {
        articles = articles.filter((article) => article.topic === query.topic)
    }
    return articles;
});

}

exports.selectComments = (article_id ) => {
    return db.query(
        `SELECT comment_id, votes, created_at, author, body
        FROM comments
        WHERE article_id=$1;`, [article_id]
    ).then((result) => {
        const comments = result.rows;
        return comments;
    });
}

exports.removeArticle = (article_id, deletedValues) => {
    return db.query(
        `UPDATE articles
        SET title = $2, body = $3, votes = $4
        WHERE article_id = $1
        RETURNING *;`, [article_id, deletedValues.title, deletedValues.body, deletedValues.votes]
    ).then((result) => {
        return result.rows[0];
    });
}

exports.insertArticle = (article) => {
    return db.query(
        `INSERT INTO articles
        (author, title, body, topic)
        VALUES 
        ($1, $2, $3, $4)
        RETURNING *;`, [article.author, article.title, article.body, article.topic]
    ).then((result) => {
        const newArticle = result.rows[0];
        newArticle.comment_count = 0;
        return newArticle;
    });
}