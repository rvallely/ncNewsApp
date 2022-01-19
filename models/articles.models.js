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

exports.selectArticles = () => {
    let count = 0;
  return db.query(
      `SELECT author, title, article_id, topic, created_at, votes
      FROM articles
      ;`
  ).then((result) => {
      let articles = result.rows
      //console.log(articles);
      // getting all the articles
      
      articles.forEach(function(article, index) {
        let article_id = article.article_id;
          console.log(article_id, '<<< id at top')
          
          return db.query(
            `SELECT * FROM comments
            WHERE article_id=${article_id}`
          ).then((result) => {
            count +=1;
            //console.log(article_id, '<<< art id')
            //console.log(result.rows.length)
            const comment_count = result.rows.length;
            article.comment_count = comment_count;
            console.log(count, '<<< count')
            if(count === 11) {
                return articles;
            }
        });
       
        

      });
      //console.log(article_ids, '<<< all ids')
     
        //getting all the article_ids
      /*  return db.query(
            `SELECT * FROM comments
            WHERE article_id=$1;`, [article_id]
        ).then((result) => {
            console.log(result.rows, '<< arti id form comments')
            // console.log(article_id, '<<< art id')
            //console.log(result.rows, '<<<result')
            
            //console.log(result.rows);
            //console.log(result.rows.length, '<<<is the length');
            //console.log(`${article_id} ${result.rows} ${result.rows.length}`)
            //console.log(articles, '<<< articles line 60')
            //const comment_count = result.rows.length;
            //article.comment_count = comment_count;
            //console.log('article')
            //console.log(article)
            //console.log(index, '<<< index');
            //console.log(count, '<<< count')
          });   

      })*/
      













      
      /*articles.forEach(function(article) {
          delete article.body;
          let article_id = article.article_id;
          return db.query(
              `SELECT * FROM comments
              WHERE article_id=$1;`, [article_id]
          ).then((result) => {
              count += 1;
              //console.log(article_id)
              //console.log(result.rows);
              //console.log(result.rows.length, '<<<is the length');
              //console.log(`${article_id} ${result.rows} ${result.rows.length}`)
              //console.log(articles, '<<< articles line 60')
              const comment_count = result.rows.length;
              article.comment_count = comment_count;
              if (count === 12) {
                console.log(articles, '<<< finidhed articles')
              }
          //return articles;
      });
      //return articles;
    });
   // console.log(articles);*/
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