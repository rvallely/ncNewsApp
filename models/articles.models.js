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
            console.log(result.rows[0]);
            const updatedArticle = result.rows[0];
            return updatedArticle;
        });
}

exports.selectArticles = () => {
  console.log('in the get art model')
  return db.query(
      `SELECT * 
      FROM articles;`
  ).then((result) => {
      //console.log(result.rows, '<<< arts');
      // remove body -- DONE
      let articles = result.rows.map((article) => {
          delete article.body;
          return article;
      });
      console.log(articles, '<<<all the articles')
      // need to add a comment_count for each each object in articles and return for controller

      /*articles.forEach(function(article) {
         // count = 0;
          // query db for all comments for the article_id
          return db.query(
            `SELECT * 
            FROM comments 
            WHERE article_id = $1`, [article.article_id]
        ).then((result) => {
            console.log(result.rows, '<<< comments for id ', article.article_id);
            console.log(result.rows.length);
            article.comment_count = result.rows.length;
            //count += 1;
            // if(count === articles.length) {
            //     console.log(articles, '<<< articles')
            //     return articles;
            // }
        });*/
          // with the result do result.rows.length to get num of comments
          // then do article.comment_count = result.rows.length
          //return article
      });
//   });
}
// 