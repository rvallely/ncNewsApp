-- \c nc_news

-- SELECT * FROM topics;
-- SELECT * FROM users;
-- SELECT * FROM articles;
-- SELECT * FROM comments;

\c nc_news_test

-- SELECT * FROM topics;
-- SELECT * FROM users;
--SELECT * FROM articles;
SELECT * FROM comments;


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

--\echo 'comments for each article'

SELECT * 
FROM comments
-- WHERE article_id=9;