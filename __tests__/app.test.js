const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const app = require('../app.js');
const  seed  = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/invalid_url', () => {
    test('Responds with status 404 and message \'Invalid URL\'', () => {
        return request(app)
          .get('/invalid_url')
          .expect(404)
          .then((res) => {
              expect(res.body.msg).toBe('Invalid URL');
          });
    });
});

describe('/api/topics', () => {
    describe('GET', () => {
        test('Responds with status: 200 and an array of topic objects. Each object should have properties:\n        - slug\n        - description.', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body.topics)).toBe(true);
                expect(response.body.topics.length).toBeGreaterThan(0)
                expect(response.body.topics.length).toBe(3);
                response.body.topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    });
                });
            });
        });
    });
});

describe('/api/comments', () => {
    describe('GET', () => {
        test('Responds with status 200 and an array of all comments available. Each comment has properties:\n        - comment_id\n        - author\n        - article_id\n        - votes\n        - created_at\n        - body.', () => {
        return request(app)
          .get('/api/comments')
          .expect(200)
          .then((response) => {     
              const comments = response.body.comments;
              expect(comments.length).toBe(18);
              comments.forEach(function(comment) {
                  expect(comment).toMatchObject({
                      comment_id: expect.any(Number), 
                      author: expect.any(String), 
                      article_id: expect.any(Number), 
                      votes: expect.any(Number),
                      created_at: expect.any(String), 
                      body: expect.any(String)
                  });
              });
          });
        });
});

describe('/api/articles/:article_id', () => {
    describe('GET', () => {
        test('Responds with status 200 and an article object which has the properties \n        - author\n        - title\n        - article_id\n        - body\n        - topic\n        - created_at\n        - votes\n        - comment_count.', () => {
            const articleId = 3;
            return request(app)
              .get(`/api/articles/${articleId}`)
              .expect(200)
              .then((response) => {
                  const article = response.body.article;
                  expect(typeof article).toBe('object');
                  expect(article).toMatchObject({
                      author: expect.any(String), 
                      title: expect.any(String),
                      article_id: expect.any(Number),
                      body: expect.any(String),
                      topic: expect.any(String),
                      created_at: expect.any(String),
                      votes: expect.any(Number),
                      comment_count: expect.any(Number)
                  });
              });
        });
        test('Responds with status 400 and returns a \'Bad Request: invalid data.\' error message, if article_id is invalid because it is the wrong data type.', () => {
            const invalid_article_id = 'two';
            return request(app)
              .get(`/api/articles/${invalid_article_id }`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: invalid data.');
              });
        }); 
        test('Responds with status 400 and returns a \'Bad Request: invalid data.\' error message, if article_id is invalid because it is a number below 1.', () => {
            const invalid_article_id = -1;
            return request(app)
              .get(`/api/articles/${invalid_article_id}`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: invalid data.');
              });
        }); 
        test('Responds with status 404 and returns a \'Not Found\' error message, if article_id is valid because it is a number >= 1, but doesn\'t yet exist.', () => {
            const article_id = 1000;
            return request(app)
              .get(`/api/articles/${article_id}`)
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not Found: this article does not exist.');
              });
        }); 
    });

    describe('PATCH', () => {
        test('Responds with a status of 200 and an updated article object, when inc_votes is positive.' , () => {
            const articleId = 5;
            let votesBefore = undefined;
            const updateVotes = { inc_votes : 20 };
            return request(app).get(`/api/articles/${articleId}`).then((res)=> {
                votesBefore = res.body.article.votes;
                return request(app)
                  .patch(`/api/articles/${articleId}`)
                  .expect(200)
                  .send(updateVotes)
                  .then((response) => {
                    const updatedArticle = response.body.updatedArticle;
                    expect(updatedArticle).toMatchObject({
                      author: expect.any(String), 
                      title: expect.any(String),
                      article_id: expect.any(Number),
                      body: expect.any(String),
                      topic: expect.any(String),
                      created_at: expect.any(String),
                      votes: expect.any(Number)
                    });
                    expect(updatedArticle.votes).toBe(votesBefore + updateVotes.inc_votes);
                  });
            });
            
        });
        test('Responds with a status of 200 and an updated article object, when inc_votes is negative.' , () => {
            const articleId = 4;
            let votesBefore = undefined;
            const updateVotes = { inc_votes : -15 };
            return request(app).get(`/api/articles/${articleId}`).then((res)=> {
                votesBefore = res.body.article.votes;
                return request(app)
                  .patch(`/api/articles/${articleId}`)
                  .expect(200)
                  .send(updateVotes)
                  .then((response) => {
                      const updatedArticle = response.body.updatedArticle;
                      expect(updatedArticle).toMatchObject({
                          author: expect.any(String), 
                          title: expect.any(String),
                          article_id: expect.any(Number),
                          body: expect.any(String),
                          topic: expect.any(String),
                          created_at: expect.any(String),
                          votes: expect.any(Number),
                      });
                      expect(updatedArticle.votes).toBe(votesBefore + updateVotes.inc_votes);
                  });
            });
            
        });
        test('Responds with a status of 200 and an updated article object, when the request body has inc_votes and extra fields.' , () => {
            const articleId = 5;
            const updateVotes = { inc_votes : 135 , voters: ['a', 'b', 'c'] };
            return request(app).get(`/api/articles/${articleId}`).then((res)=> {
                votesBefore = res.body.article.votes;
                return request(app)
                  .patch(`/api/articles/${articleId}`)
                  .expect(200)
                  .send(updateVotes)
                  .then((response) => {
                    const updatedArticle = response.body.updatedArticle;
                    expect(updatedArticle).toMatchObject({
                      author: expect.any(String), 
                      title: expect.any(String),
                      article_id: expect.any(Number),
                      body: expect.any(String),
                      topic: expect.any(String),
                      created_at: expect.any(String),
                      votes: expect.any(Number)
                    });
                    expect(updatedArticle.votes).toBe(votesBefore + updateVotes.inc_votes);
                  });
            });
        });
        test('Responds with a status of 400 and a \'Bad Request: missing field(s) or incorrect data type\' error message when required inc_votes field is missing.', (
        ) => {
            const articleId = 5;
            const updateVotes = { likes: 52 , voters: ['a', 'b', 'c'] };
            return request(app)
              .patch(`/api/articles/${articleId}`)
              .expect(400)
              .send(updateVotes)
              .then((res)=> {
                  expect(res.body.msg).toBe('Bad Request: missing field(s) or incorrect data type');
              });
        });
        test('Responds with a status of 400 and a \'Bad Request: missing field(s) or incorrect data type\' error message when required inc_votes field\'s value has the wrong data type.', () => {
            const articleId = 5;
            const updateVotes = { inc_votes: 'fifty'};
            return request(app)
              .patch(`/api/articles/${articleId}`)
              .send(updateVotes)
              .expect(400)
              .then((res)=> {
                expect(res.body.msg).toBe('Bad Request: missing field(s) or incorrect data type');
              });
                  
        });
        test('Responds with a status of 400 and a \'Bad Request: invalid data.\' error message when article_id is not a number >= 1.', () => {
            const articleId = -20;
            const updateVotes = { inc_votes: 50};
            return request(app)
              .patch(`/api/articles/${articleId}`)
              .send(updateVotes)
              .expect(400)
              .then((res)=> {
                expect(res.body.msg).toBe('Bad Request: invalid data.');
              });      
        });
        test('Responds with a status of 400 and a \'Bad Request: invalid data.\' error message when article_id is not a number >= 1.', () => {
            const articleId = 'fifty';
            const updateVotes = { inc_votes: 50};
            return request(app)
              .patch(`/api/articles/${articleId}`)
              .send(updateVotes)
              .expect(400)
              .then((res)=> {
                expect(res.body.msg).toBe('Bad Request: invalid data.');
              });      
        });
        test('Responds with a status of 404 and a \'Not Found\' error message when article_id is a number >= 1, but does not exist.', () => {
            const articleId = 55;
            const updateVotes = { inc_votes: 50};
            return request(app)
              .patch(`/api/articles/${articleId}`)
              .send(updateVotes)
              .expect(404)
              .then((res)=> {
                expect(res.body.msg).toBe('Not Found');
              });      
        });            
    });
  /*  describe('DELETE', () => {
        test('Responds with status 204 and no content. Deletes article by article_id given, when article exists.', () => {
            const article_id = 7;
            let articleNumberBefore = undefined;
            return request(app).get('/api/articles').then((res) => {
                articleNumberBefore = res.body.articles.length;
                return request(app)
                  .delete(`/api/articles/${article_id}`)
                  .expect(204)
                  .then((res) => {
                    expect(res.body).toEqual({});
                    let articleNumberAfter = undefined;
                    return request(app)
                      .get('/api/articles')
                      .then((res) => {
                        articleNumberAfter = res.body.articles.length;
                        expect(articleNumberAfter).toBe(articleNumberBefore - 1)
                    });            
                  }); 
            });
        });
        test('Responds with a status of 400 and \'Bad Request: invalid data.\' error message if the article_id is invalid because it is a number < 1.', () => {
            const article_id = -17;
            return request(app)
              .delete(`/api/articles/${article_id}`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: invalid data.')
              });
        });
        test('Responds with a status of 400 and \'Bad Request: invalid data.\' error message if the article_id is invalid because it is the wrong data type.', () => {
            const article_id = { article_id: 3 };
            return request(app)
              .delete(`/api/articles/${article_id}`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: invalid data.')
              });
        });
        test('Responds with a status of 404 and \'Not Found: this article does not exist.\' error message if the article_id is valid because it is a number >= 1, but does not exist.', () => {
            const article_id = 20;
            return request(app)
              .delete(`/api/articles/${article_id}`)
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not Found: this article does not exist.')
              });
        });
    });*/
});

describe('/api/articles', () => {
    describe('GET', () => {  
        test('Responds with status 200 and an array of article objects. Each article object should have the properties:\n        - author\n        - title\n        - article_id\n        - topic\n        - created_at\n        - votes\n        - comment_count', () => {
            return request(app)
              .get('/api/articles/')
              .expect(200)
              .then((response) => { 
                  const articles = response.body.articles;
                  expect(articles.length).toBeGreaterThan(0);
                  expect(Array.isArray(articles)).toBe(true);
                  articles.forEach((article) => {
                      expect(article).toMatchObject({
                          author: expect.any(String), 
                          title: expect.any(String),
                          article_id: expect.any(Number),
                          topic: expect.any(String),
                          created_at: expect.any(String),
                          votes: expect.any(Number),
                          comment_count: expect.any(Number)
                      });
                  });
                  expect(articles.length).toBe(12);
              });
       
        });
        test('When no query is specified responds with status 200 and an array of article objects sorted by date in descending order.', () => {
            return request(app)
              .get('/api/articles')
              .expect(200)
              .then((res) => {
                  const articles = res.body.articles;
                  expect(articles.length).toBeGreaterThan(0);
                  expect(Array.isArray(articles)).toBe(true);
                  const sortedArticles = [... articles].sort(function(a, b) {
                    if(a.created_at > b.created_at) {
                        return -1;
                    }
                    if(a.created_at < b.created_at) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                expect(articles).toEqual(sortedArticles);
              });
        });
        test('When a column to sort by is specified, but not an order (ASC/DESC) as a query, responds with status 200 and an array of articles objects sorted by this column in descending order.', () => {
            return request(app)
              .get('/api/articles?sort_by=author')
              .expect(200)
              .then((res) => {
                  const articles = res.body.articles;
                  expect(articles.length).toBeGreaterThan(0);
                  const sortedArticles = [... articles].sort(function(a, b) {
                    if(a.author > b.author) {
                        return -1;
                    }
                    if(a.author < b.author) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                expect(articles).toEqual(sortedArticles);
              });
        });
        test('When a column to sort by is comment_count, but no order (ASC/DESC) is specified in the query, responds with status 200 and an array of articles objects sorted by this comment_count in desceneding order.', () => {
            return request(app)
              .get('/api/articles?sort_by=comment_count')
              .expect(200)
              .then((res) => {
                  const articles = res.body.articles;
                  expect(articles.length).toBeGreaterThan(0);
                  const sortedArticles = [... articles].sort(function(a, b) {
                    if(a.comment_count > b.comment_count) {
                        return -1;
                    }
                    if(a.comment_count < b.comment_count) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                expect(articles).toEqual(sortedArticles);
              });
        });
        test('When a column and the order ASC are specified in the query, responds with status 200 and an array of article objects sorted by that column in ascending order.', () => {
            return request(app)
              .get('/api/articles?sort_by=title&order=ASC')
              .expect(200)
              .then((res) => {
                  const articles = res.body.articles;

                  expect(articles.length).toBeGreaterThan(0);
                  const sortedArticles = [... articles].sort(function(a, b) {
                    if(a.title < b.title) {
                        return -1;
                    }
                    if(a.title > b.title) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                expect(articles).toEqual(sortedArticles);
              });
        });
        test('When a column and the order DESC are specified in the query, responds with status 200 and an array of article objects sorted by that column in descending order.', () => {
            return request(app)
              .get('/api/articles?sort_by=topic&order=DESC')
              .expect(200)
              .then((res) => {
                  const articles = res.body.articles;
                  expect(articles.length).toBeGreaterThan(0);
                  const sortedArticles = [... articles].sort(function(a, b) {
                    if(a.topic > b.topic) {
                        return -1;
                    }
                    if(a.topic < b.topic) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                expect(articles).toEqual(sortedArticles);
              });
        });
        test('When an order is specified in the query but no column name, the default column to sort by is created_at. Responds with status 200 and an array of article objects sorted by created_at in order specified.', () => {
            return request(app)
              .get('/api/articles/?order=ASC')
              .expect(200)
              .then((res) => {
                  const articles = res.body.articles;
                  expect(articles.length).toBeGreaterThan(0);
                  expect(Array.isArray(articles)).toBe(true);
                  const sortedArticles = [... articles].sort(function(a, b) {
                    if(a.created_at < b.created_at) {
                        return -1;
                    }
                    if(a.created_at > b.created_at) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                expect(articles).toEqual(sortedArticles);
              });   
        });
        test('Responds with a status 404 and the error message \'Not Found\' if the column specified in the query to sort by does not exist.', () => {
            return request(app)
              .get('/api/articles/?sort_by=likes&order=ASC')
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not Found: this column does not exist');
              });
        });
        test('Responds with a status of 200 and an array of article objects filtered by topic, when valid topic is specified in the query.', () => {
            return request(app)
              .get('/api/articles/?topic=cats')
              .expect(200)
              .then((res) => {
                  const articles = res.body.articles;
                  expect(Array.isArray(articles));
                  expect(articles.length).toBe(1);
                  expect(articles).toEqual([
                    {
                      author: 'rogersop',
                      title: 'UNCOVERED: catspiracy to bring down democracy',
                      article_id: 5,
                      topic: 'cats',
                      created_at: '2020-08-03T13:14:00.000Z',
                      votes: 0,
                      comment_count: 2
                    }
                  ]);
              }); 
        });
        test('Responds with a status of 200 and an array of article objects filtered by topic, when topic specified in the query is valid. With no sort by and order specified in query, articles are sorted by default through created_at column and in descending order', () => {
            return request(app)
              .get('/api/articles/?topic=mitch')
              .expect(200)
              .then((res) => {
                  const articles = res.body.articles;
                  expect(articles.length).toBe(11);
                  const sortedArticles = [... articles].sort(function(a, b) {
                    if(a.created_at > b.created_at) {
                        return -1;
                    }
                    if(a.created_at < b.created_at) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                expect(articles).toEqual(sortedArticles); 
              }); 
        });
        test('Responds with a status of 200 and an array of article objects filtered by topic, when topic specified in the query is valid. When sort by and order are specified in the query, articles are sorted according to this.', () => {
            return request(app)
              .get('/api/articles/?sort_by=title&order=ASC&topic=mitch')
              .expect(200)
              .then((res) => {
                  const articles = res.body.articles;
                  expect(articles.length).toBe(11);
                  const sortedArticles = [... articles].sort(function(a, b) {
                    if(a.title < b.title) {
                        return -1;
                    }
                    if(a.title > b.title) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                expect(articles).toEqual(sortedArticles); 
              }); 
        });
        test('Responds with a status of 200 and an array of article objects filtered by topic, when topic specified in the query is valid. When sort by and no order are specified in the query, articles are sorted by specified column and in descending order.', () => {
            return request(app)
              .get('/api/articles/?sort_by=article_id&topic=mitch')
              .expect(200)
              .then((res) => {
                  const articles = res.body.articles;
                  expect(articles.length).toBe(11);
                  const sortedArticles = [... articles].sort(function(a, b) {
                    if(a.article_id > b.article_id) {
                        return -1;
                    }
                    if(a.article_id < b.article_id) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                expect(articles).toEqual(sortedArticles); 
              }); 
        });
        test('Responds with a status of 200 and an array of article objects filtered by topic, when topic specified in the query is valid. When no sort_by is given, but an order is given, array is sorted by created_at and with given order.', () => {
            return request(app)
              .get('/api/articles/?order=ASC&topic=mitch')
              .expect(200)
              .then((res) => {
                  const articles = res.body.articles;
                  expect(articles.length).toBe(11);
                  const sortedArticles = [... articles].sort(function(a, b) {
                    if(a.created_at < b.created_at) {
                        return -1;
                    }
                    if(a.created_at > b.created_at) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                expect(articles).toEqual(sortedArticles); 
              }); 
        });
        test('Responds with status 404 and an error message \'Not Found: topic does not exist\'', () => {
            return request(app)
              .get('/api/articles/?topic=news')
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not Found: topic does not exist');
              });
        });
        test('Responds with status 400 and an error message \'Bad Request: order is invalid\' when order passed into query is not ASC or DESC.', () => {
            return request(app)
              .get('/api/articles/?topic=mitch&order=ascend')
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: order is invalid');
              });
        });
    });
});

describe('/api/articles/:article_id/comments', () => {
    describe('GET', () => {
        test('Responds with a status of 200 and an array of comment objects for the given article id, when article_id has at least one comment. Each object should have the properties:\n        - comment_id\n        - votes\n        - created_at\n        - author\n        - body.', () => {
            const article_id = 9;
            return request(app)
              .get(`/api/articles/${article_id}/comments`)
              .expect(200)
              .then((response) => {
                const comments = response.body.comments
                expect(comments.length).toBeGreaterThan(0);
                comments.forEach(function(comment) {
                    expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: (expect.any(String)),
                    author: expect.any(String),
                    body: expect.any(String)
                    });
                });
              });
        });
        test('Responds with a status of 200 and an empty array of comment objects for the given article id, when article_id has no comments.', () => {
            const article_id = 7;
            return request(app)
              .get(`/api/articles/${article_id}/comments`)
              .expect(200)
              .then((response) => {
                const comments = response.body.comments
                expect(Array.isArray(comments)).toBe(true);
                expect(comments.length).toBe(0);
              });
        });
        test('Responds with a status of 400 and returns a \'Bad Request: invalid data.\' error message, if article_id is invalid because it is the wrong data type.', () => {
            const invalid_id = 'two';
            return request(app)
              .get(`/api/articles/${invalid_id}/comments`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: invalid data.');
              });
        });
        test('Responds with a status of 400 and returns a \'Bad Request: invalid data.\' error message, if article_id is invalid because it is a number below 1.', () => {
            const invalid_id = -25;
            return request(app)
              .get(`/api/articles/${invalid_id}/comments`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: invalid data.');
              });
        });
        test('Responds with status 404 and returns a \'Not Found\' error message, if article_id is valid because it is a number >= 1, but doesn\'t yet exist.', () => {
            const article_id = 987;
            return request(app)
              .get(`/api/articles/${article_id}/comments`)
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not Found');
              });
        }); 
    });
    describe('POST', () => {
        test('Responds with a status of 201 and a posted comment object and posts new comment. The comment to post must have the properties\n        - username\n        - body.', () => {
            const article_id = 10;
            const newComment = { 
                body: 'Test comment.',
                username: 'butter_bridge',
            }
            let commentNumberBefore = undefined;
            return request(app)
              .get('/api/comments')
              .then((res) => {
                  commentNumberBefore = res.body.comments.length;
                  return request(app)
                      .post(`/api/articles/${article_id}/comments`)
                      .send(newComment)
                      .expect(201)
                      .then((response) => {
                          const postedComment = response.body.comment;
                          expect(postedComment).toMatchObject({ 
                              comment_id: 19,
                              author: 'butter_bridge',
                              article_id: article_id,
                              votes: 0,
                              created_at: expect.any(String),
                              body: expect.any(String)
                          });
                          let commentNumberAfter = undefined;
                          return request(app)
                              .get('/api/comments')
                              .then((res) => {
                                  commentNumberAfter = res.body.comments.length;
                                  expect(commentNumberAfter).toBe(commentNumberBefore + 1);
                              });
                      });
              });
        });
        test('Responds with a status of 400 and returns a \'Bad Request: invalid data.\' error message, if article_id is invalid because it is the wrong data type.', () => {
            const invalid_id = 'two';
            const newComment = { 
                body: 'Test comment.',
                username: 'butter_bridge',
            }
            return request(app)
              .post(`/api/articles/${invalid_id}/comments`)
              .send(newComment)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: invalid data.');
              });
        });
        test('Responds with a status of 400 and returns a \'Bad Request: invalid data.\' error message, if article_id is invalid because it is a number below 1.', () => {
            const invalid_id = 0;
            const newComment = { 
                body: 'Test comment.',
                username: 'butter_bridge',
            }
            return request(app)
              .post(`/api/articles/${invalid_id}/comments`)
              .send(newComment)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: invalid data.');
              });
        });
        test('Responds with a status of 404 and returns a \'Not Found\' error message, if article_id is valid because it is a number >= 1, but doesn\'t yet exist.', () => {
            const article_id = 22;
            const newComment = { 
                body: 'Test comment.',
                username: 'butter_bridge',
            }
            return request(app)
              .post(`/api/articles/${article_id}/comments`)
              .send(newComment)
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not Found');
              });
        }); 
        test('Responds with a status of 400 and returns a \'Bad Request: missing field(s)\' error message if there is a missing field.', () => {
            const article_id = 2;
            const newComment = { 
                username: 'butter_bridge',
            }
            return request(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('Bad Request: missing field(s)');
            });
        });
        test('Responds with a status of 201 and a posted comment object with extra fields omitted, when the comment has username and body properties and extra fields.', () => {
            const article_id = 10;
            const newComment = { 
                body: 'Test comment.',
                username: 'butter_bridge',
                likes: 10000, 
            }
            return request(app)
              .post(`/api/articles/${article_id}/comments`)
              .send(newComment)
              .expect(201)
              .then((res) => {
                const postedComment = res.body.comment;
                expect(postedComment).toMatchObject({ 
                    comment_id: 19,
                    author: 'butter_bridge',
                    article_id: 10,
                    votes: 0,
                    created_at: expect.any(String),
                    body: 'Test comment.'
                });
              });
        });
        test('Responds with a status of 400 and returns a \'Bad Request: User not in the database\' error message if the user is not already in the database.', () => {
            const article_id = 5;
            const newComment = { 
                body: 'Test comment.',
                username: 'new_user',
            }
            return request(app)
              .post(`/api/articles/${article_id}/comments`)
              .send(newComment)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: User not in the database')
              });
        });
        test('Responds with a status 400 and a \'Bad Request: missing field(s)\' error message when the comment has undefined values.', () => {
            const article_id = 5;
            const newComment = { 
                body: undefined,
                username: 'butter_bridge',
            }
            return request(app)
              .post(`/api/articles/${article_id}/comments`)
              .send(newComment)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: missing field(s)');
              });
        });
    });
});


describe('/api/comments/:comment_id', () => {
    describe('GET', () => {
        test('Responds with status 200 and a comment object of given comment_id, when comment exists.', () => {
            const comment_id = 7;
            return request(app)
              .get(`/api/comments/${comment_id}`)
              .expect(200)
              .then((res) => {
                  const comment = res.body.comment;
                  expect(comment).toMatchObject({
                      comment_id: 7, 
                      author: 'icellusedkars',
                      article_id: 1, 
                      votes: 0, 
                      created_at: '2020-05-15T20:19:00.000Z', 
                      body: 'Lobster pot'
                  });
              });
        });
        test('Responds with a status of 400 and returns a \'Bad Request: invalid data.\' error message, if comment_id is invalid because it is a number below 1.', () => {
            const comment_id = -2;
            return request(app)
              .get(`/api/comments/${comment_id}`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: invalid data.');
              });
        });
        test('Responds with a status of 400 and returns a \'Bad Request: invalid data.\' error message, if comment_id is invalid because it is the wrong data type.', () => {
            const comment_id = 'three';
            return request(app)
              .get(`/api/comments/${comment_id}`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: invalid data.');
              });
        });
        test('Responds with a status of 404 and returns a \'Not Found\' error message, if comment_id is valid because it is a number >= 1, but doesn\'t yet exist.', () => {
            const comment_id = 600;
            return request(app)
              .get(`/api/comments/${comment_id}`)
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not Found');
              });
        });
    });
    describe('DELETE', () => {
        test('Responds with status 204 and no content. Deletes comment by comment_id given, when comment exists.', () => {
            const comment_id = 7;
            let commentNumberBefore = undefined;
            return request(app).get('/api/comments').then((res) => {
                commentNumberBefore = res.body.comments.length;
                return request(app)
                  .delete(`/api/comments/${comment_id}`)
                  .expect(204)
                  .then((res) => {
                    expect(res.body).toEqual({});
                    let commentNumberAfter = undefined;
                    return request(app)
                      .get('/api/comments')
                      .then((res) => {
                        commentNumberAfter = res.body.comments.length;
                        expect(commentNumberAfter).toBe(commentNumberBefore - 1)
                    });            
                  }); 
            });
        });
        test('Responds with a status of 400 and \'Bad Request: invalid data.\' error message if the comment_id is invalid because it is a number < 1.', () => {
            const comment_id = -17;
            return request(app)
              .delete(`/api/comments/${comment_id}`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: invalid data.')
              });
        });
        test('Responds with a status of 400 and \'Bad Request: invalid data.\' error message if the comment_id is invalid because it is the wrong data type.', () => {
            const comment_id = { comment_id: 3 };
            return request(app)
              .delete(`/api/comments/${comment_id}`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request: invalid data.')
              });
        });
        test('Responds with a status of 404 and \'Not Found\' error message if the comment_id is valid because it is a number >= 1, but does not exist.', () => {
            const comment_id = 20;
            return request(app)
              .delete(`/api/comments/${comment_id}`)
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not Found')
              });
        });
    });
    describe('PATCH', () => {
        test('Responds with a status 200 and an updated comment object, when inc_votes value is positive.', () => {
            const comment_id = 7;
            const voteChange = { inc_votes: 1 };
            return request(app).get(`/api/comments/${comment_id}`).then((res)=> {
                votesBefore = res.body.comment.votes;
        
                return request(app)
                  .patch(`/api/comments/${comment_id}`)
                  .expect(200)
                  .send(voteChange)
                  .then((response) => {
                      const updatedComment = response.body.updatedComment;
                      expect(updatedComment).toMatchObject({
                        comment_id: 7, 
                        author: 'icellusedkars',
                        article_id: 1, 
                        votes: 1, 
                        created_at: '2020-05-15T20:19:00.000Z', 
                        body: 'Lobster pot'
                      });

                      expect(updatedComment.votes).toBe(votesBefore + voteChange.inc_votes);
                    });
                  });

        })
        test('Responds with a status 200 and an updated comment object, when inc_votes value is negative.', () => {
            const comment_id = 7;
            const voteChange = { inc_votes: -1 };

            return request(app).get(`/api/comments/${comment_id}`).then((res)=> {
                votesBefore = res.body.comment.votes;

                return request(app)
                  .patch(`/api/comments/${comment_id}`)
                  .expect(200)
                  .send(voteChange)
                  .then((response) => {
                      const updatedComment = response.body.updatedComment;
                      expect(updatedComment).toMatchObject({
                        comment_id: 7, 
                        author: 'icellusedkars',
                        article_id: 1, 
                        votes: -1, 
                        created_at: '2020-05-15T20:19:00.000Z', 
                        body: 'Lobster pot'
                      });
                
                      expect(updatedComment.votes).toBe(votesBefore + voteChange.inc_votes);
                  });
            });
        });
        test('Responds with a status 200 and an unchanged comment object, when inc_votes value is missing.', () => {
            const comment_id = 7;
            const voteChange = {mising_key: 1};
            return request(app).get(`/api/comments/${comment_id}`).then((res)=> {
                votesBefore = res.body.comment.votes;
        
                return request(app)
                  .patch(`/api/comments/${comment_id}`)
                  .expect(200)
                  .send(voteChange)
                  .then((response) => {
                      const updatedComment = response.body.updatedComment;
                      expect(updatedComment).toMatchObject({
                        comment_id: 7, 
                        author: 'icellusedkars',
                        article_id: 1, 
                        votes: 0, 
                        created_at: '2020-05-15T20:19:00.000Z', 
                        body: 'Lobster pot'
                      });

                      expect(updatedComment.votes).toEqual(votesBefore);
                    });
                  });

        });
        test('Responds with a status 400 and an error message \'Bad Request: Invalid data type\' when inc_votes value is not a number.', () => {
            const comment_id = 7;
            const voteChange = { inc_votes: 'not_a_number' };

                return request(app)
                  .patch(`/api/comments/${comment_id}`)
                  .expect(400)
                  .send(voteChange)
                  .then((response) => {
                      const msg = response.body.msg;
                      expect(msg).toBe('Bad Request: Invalid data type');
                  });
        });
        test('Responds with a status 400 and an error message \'Bad Request: Invalid data type\' when comment_id is not a number.', () => {
            const comment_id = 'seven';
            const voteChange = { inc_votes: 1 };

                return request(app)
                  .patch(`/api/comments/${comment_id}`)
                  .expect(400)
                  .send(voteChange)
                  .then((response) => {
                      const msg = response.body.msg;
                      expect(msg).toBe('Bad Request: Invalid data type');
                  });
        });
        test('Responds with a status 404 and an error message \'Not Found: comment id does not exist\' when comment_id is valid because it is a number, but does not yet exist.', () => {
            const comment_id = 999;
            const voteChange = { inc_votes: 1 };

                return request(app)
                  .patch(`/api/comments/${comment_id}`)
                  .expect(404)
                  .send(voteChange)
                  .then((response) => {
                      const msg = response.body.msg;
                      expect(msg).toBe('Not Found: comment id does not exist');
                  });
        });
    });
});
});

describe('/api/users', () => {
    describe('GET', () => {
        test('Responds with status 200 and an array of all user objects available. Each user object has property username', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then((response) => {  
              const users = response.body.users;
              expect(Array.isArray(users)).toBe(true);
              expect(users.length).toBeGreaterThan(0);
              users.forEach((user) => {
                  expect(typeof user).toBe('object');
                  expect(user.hasOwnProperty('username'));
                  expect(typeof user.username).toBe('string');
                  expect(user.username.length).toBeGreaterThan(0);
              }); 
          });
        });
    });
});  

describe('/api/users/:username', () => {
    describe('GET', () => {
        test('Responds with status 200 and a single user object with the properties: \n        - username\n        - avatar_url\n        - name.', () => {
        const username = 'icellusedkars';
        return request(app)
          .get(`/api/users/${username}`)
          .expect(200)
          .then((response) => {  
              const user = response.body.user;
              expect(typeof user).toBe('object');
              expect(user).toMatchObject({ 
                username: 'icellusedkars',
                avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
                name: 'sam'
            });
          });
        });
        test('Responds with status 404  and returns a \'Not Found\' error message, if username is valid because it is a string, but doesn\'t yet exist.', () => {
            const username = 'non_existent_user';
            return request(app)
              .get(`/api/users/${username}`)
              .expect(404)
              .then((response) => {
                expect(response.body.msg).toBe('Not Found');
              });
            });
        });
        test('Responds with status 400  and returns a \'Bad Request: maximum characters exceeded\' error message, if username is invalid because it has more than 30 characters.', () => {
            const username = 'non_existent_user_with_too_many_characters';
            return request(app)
              .get(`/api/users/${username}`)
              .expect(400)
              .then((response) => {
                expect(response.body.msg).toBe('Bad Request: Username cannot exceed 30 characters.');
              });
        });
}); 

describe('/api', () => {
    describe('GET', () => {
        test('Responds with JSON describing all the available endpoints on the API.', () => {
            return request(app) 
              .get('/api')
              .expect(200) // 
              .then((response) => {
                  expect(typeof response).toBe('object');
                  const keys = (Object.keys(response.body));
                  keys.forEach((key) => {
                      expect(/POST|GET|PATCH|DELETE/g.test(key.split(' ')[0])).toBe(true);
                      expect(/\/api/g.test(key.split(' ')[1].slice(0, 4))).toBe(true);
                  });
              });
        }); 
    });
}); 