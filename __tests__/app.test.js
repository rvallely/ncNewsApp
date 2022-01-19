const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const app = require('../app.js');
const  seed  = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api/comments', () => {
    describe('GET', () => {
        test('Responds with status 200 and an array of all comments available. Each comment has properties:\n        - comment_id\n        - author\n        - article_id\n        - votes\n        - created_at\n        - body.', () => {
        return request(app)
          .get('/api/comments')
          .expect(200)
          .then((response) => {
              console.log(response.body.comments, '<<< comments')
              const comments = response.body.comments
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

describe('/api/topics', () => {
    describe('GET', () => {
        test('Responds with status: 200 and an array of topic objects. Each object should have properties:\n        - slug\n        - description.', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body.topics)).toBe(true);
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

describe('/api/articles/:article_id', () => {
    describe('GET', () => {
        test('Responds with a status and an article object which has the properties \n        - author\n        - title\n        - article_id\n        - body\n        - topic\n        - created_at\n        - votes\n        - comment_count.', () => {
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
    });
    describe('PATCH', () => {
        // should patch be 200 or 201??
        test('Responds with an updated article object, when votes to increase by is positive.' , () => {
            const articleId = 5;
            let votesBefore = undefined;
            const updateVotes = { inc_votes : 20 };
            const articleBefore = request(app).get(`/api/articles/${articleId}`).then((res)=> {
                votesBefore = res.body.article.votes;
            });
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
        test('Responds with an updated article object, when votes to increase by is negative.' , () => {
            const articleId = 4;
            let votesBefore = undefined;
            const updateVotes = { inc_votes : -15 };
            const articleBefore = request(app).get(`/api/articles/${articleId}`).then((res)=> {
                votesBefore = res.body.article.votes;
            });
            return request(app)
              .patch(`/api/articles/${articleId}`)
              .expect(200)
              .send(updateVotes)
              .then((response) => {
                  const updatedArticle = response.body.updatedArticle;
                  console.log(updatedArticle, '<< upda art')
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
});

describe('/api/articles', () => {
    describe('GET', () => {
        test('Responds with status 200 and an array of article objects. Each article object should have the properties:\n        - author\n        - title\n        - article_id\n        - topic\n        - created_at\n        - votes\n        - comment_count', () => {
            return request(app)
              .get('/api/articles/')
              .expect(200)
              .then((response) => { 
                  
                  const articles = response.body.articles;
                  console.log(articles);
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
                  // how to match the content of each object?
              });
        });
    });
});

describe('/api/articles/:article_id/comments', () => {
    describe('GET', () => {
        test('Responds with a status of 200 and an array of comment objects for the given article id. Each object should have the properties:\n        - comment_id\n        - votes\n        - created_at\n        - author\n        - body.', () => {
            const article_id = 9;
            return request(app)
              .get(`/api/articles/${article_id}/comments`)
              .expect(200)
              .then((response) => {
                console.log(response.body.comments)
                const comments = response.body.comments
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
    });
    describe('POST', () => {
        test.only('Responds with a posted comment object and posts new comment.', () => {
            const article_id = 10;
            const newComment = { 
                body: 'Test comment.',
                username: 'butter_bridge',
            }
            let commentNumberBefore = undefined;
            let getAllCommentsBefore = request(app).get('/api/comments').then((res) => {
                commentNumberBefore = res.body.comments.length;
            });
            return request(app)
              .post(`/api/articles/${article_id}/comments`)
              .expect(201)
              .send(newComment)
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
})
});
