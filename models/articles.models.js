const db = require('../db/connection.js');
const comments = require('../db/data/test-data/comments.js');

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

/*exports.selectArticles = () => {
    
    return db.query(
      `SELECT author, title, article_id, topic, created_at, votes
      FROM articles
      ;`
    ).then((result) => {
      let articles = result.rows
    let count = 0;  
    articles.forEach((article) => {
          const article_id = article.article_id;
          return db.query(
              `SELECT *
              FROM comments
              WHERE article_id = $1;`, [12]
          ).then((res) => {
              console.log(article_id, '<<< id')
              const comment_count = res.rows.length;
              article.comment_count = comment_count;
              //count += 1;
              //if (count === 11) {
                  console.log(articles, '<<< articles at 11')
              //}

          });
      });
    });
}*/

exports.selectArticles = () => {
    let count = 0;
    let obj = {};
    const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];  
    // const id1 = ids[0]
    // const id12= ids[11];
    ids.forEach((id) => {
    // console.log(id, '<<< id before query')
    return db.query(
        `SELECT *
        FROM comments
        WHERE article_id = $1`, [id]
    ).then((res) => {
        console.log(id, '<<< id after query')
        count += 1;
        //console.log(id, '<<id');  //comms>> ', res.rows.length
        obj[id] = res.rows.length;
        if(count === 11) {
            console.log(obj);
        }
    })    
  });
}

   //   console.log(articles, '<<< articles')
    // for each article in articles(12) 
    // make a request to the server and get all the comments for each each article_id
    // get length of rows a
    // assign this length as article.comment_count 
    // for each article
    // then return array once all 12 have had comment_count added


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