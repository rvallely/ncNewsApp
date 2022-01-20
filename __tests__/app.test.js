const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const app = require('../app.js');
const  seed  = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

// BELOW is example copied from lecture - remove or edit as appropriate
describe('/invalid_url', () => {
    test('Responds with status 404 and message \'Invalid URL\'', () => {
        return request(app)
          .get('invalid_url')
          .expect(404)
          .then((res) => {
              expect(res.body.msg).toBe('Invalid URL');
          });
    })
})

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

describe('/api/comments', () => {
    describe('GET', () => {
        test('Responds with status 200 and an array of all comments available. Each comment has properties:\n        - comment_id\n        - author\n        - article_id\n        - votes\n        - created_at\n        - body.', () => {
        return request(app)
          .get('/api/comments')
          .expect(200)
          .then((response) => {     
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

describe('/api/articles/:article_id', () => {
    describe('GET', () => {
        test.only('Responds with status 200 and an article object which has the properties \n        - author\n        - title\n        - article_id\n        - body\n        - topic\n        - created_at\n        - votes\n        - comment_count.', () => {
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
        //LECTURE  ----
        // below is the test for invalid article id (not a number, or number<0)
        // possibly taken care of this in building db as specified only allow numbers
        test('Responds with status 400 and returns an \'Bad Request\' error message', () => {
            const invalid_article_id = 'two';
            return request(app)
              .get(`/api/articles/${invalid_article_id }`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request');
              });
        }); 
        test.only('Responds with status 404 and returns an \'Bad Request\' error message', () => {
            const article_id = 1000;
            return request(app)
              // valid article id, but doesn't exist yet (a number > 0)
              .get(`/api/articles/${article_id}`)
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not found');
              });
        }); 
        //LECTURE NOTES END -----
    });
    describe('PATCH', () => {
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

describe.skip('/api/articles', () => {
    describe('GET', () => {
        test('Responds with status 200 and an array of article objects. Each article object should have the properties:\n        - author\n        - title\n        - article_id\n        - topic\n        - created_at\n        - votes\n        - comment_count', () => {
            return request(app)
              .get('/api/articles/')
              .expect(200)
              .then((response) => { 
                  console.log(response.body)
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

// add when they exist to tests for successful tests
describe('/api/articles/:article_id/comments', () => {
    describe('GET', () => {
        test('Responds with a status of 200 and an array of comment objects for the given article id. Each object should have the properties:\n        - comment_id\n        - votes\n        - created_at\n        - author\n        - body.', () => {
            const article_id = 9;
            return request(app)
              .get(`/api/articles/${article_id}/comments`)
              .expect(200)
              .then((response) => {
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
        test('Responds with a posted comment object and posts new comment.', () => {
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
});
});

describe('/api/comments/:comment_id', () => {
    describe('GET', () => {
        test('Responds with comment object of given a comment_id, when comment exists.', () => {
            const comment_id = 7;
            return request(app)
              .get(`/api/comments/${comment_id}`)
              .expect(200)
              .then((res) => {
                  const comment = res.body.comment;
                  //console.log(res.body);
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
    });
    describe('DELETE', () => {
        test('Responds with status 204 and no content. Deletes comment by comment_id given, when comment exists.', () => {
            const comment_id = 7;
            let commentNumberBefore = undefined;
            let getAllCommentsBefore = request(app).get('/api/comments').then((res) => {
                commentNumberBefore = res.body.comments.length;
            });
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
                    expect(commentNumberAfter).toBe(commentNumberBefore - 1);
                    return request(app).get(`/api/comments/${comment_id}`).then((response) => {
                        expect(response.body).toEqual({});
                    });
                  }); 
              });
        });
    });
});

// LEFT at point of needing to complete test for GET /api to get JSON of all available endpoints
// Also need to get GET /api/articles working.
// Then hosting and tidying up
describe('/api', () => {
    describe('GET', () => {
        test('Responds with JSON describing all the available endpoints on the API.', () => {
            return request(app) 
              .get('/api')
              .expect(200) // or maybe 201??
              .then((response) => {
                  //
              });
        });
    });
});