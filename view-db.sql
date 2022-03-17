\c nc_news

-- SELECT * FROM topics;
-- SELECT * FROM users;
-- SELECT * FROM articles;
-- SELECT * FROM comments;

-- \c nc_news_test

-- SELECT * FROM topics;
SELECT * FROM users;
--SELECT * FROM articles;



-- \echo 'article before'

-- SELECT *
-- FROM articles
-- WHERE article_id = 5;


-- UPDATE articles
-- SET votes = votes + 20
-- WHERE article_id = 5;

-- \echo 'article after'
-- SELECT * 
-- FROM articles
-- WHERE article_id = 5;

-- \echo 'article before'

-- SELECT *
-- FROM articles
-- WHERE article_id = 4;


-- UPDATE articles
-- SET votes = votes -15
-- WHERE article_id = 4;

-- \echo 'article after'
-- SELECT * 
-- FROM articles
-- WHERE article_id = 4;

\echo 'all the articles'

SELECT * 
FROM articles;

\echo 'all the comments'

SELECT * FROM comments;

-- \echo 'articles and comments joined'

-- SELECT COUNT(article_id) AS comment_count
-- FROM articles
-- WHERE article_id = 1;
-- LEFT JOIN comments ON comments.article_id = articles.article_id;

-- SELECT COUNT(article_id) AS comment_count
-- FROM articles
-- LEFT JOIN comments ON comments.article_id = articles.article_id;
-- GROUP BY article_id;
\echo 'comment_count article_ids'

-- SELECT COUNT(article_id) AS comment_count
-- FROM comments
-- WHERE article_id = 1
SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id;
--ORDER BY articles.article_id ASC;

-- SELECT *
-- FROM articles
-- LEFT JOIN comments ON comments.article_id = articles.article_id;


-- SELECT articles.*, COUNT(article_id) AS comment_count
-- FROM articles
-- LEFT JOIN comments ON comments.article_id = articles.article_id;
-- GROUP BY article_id;
