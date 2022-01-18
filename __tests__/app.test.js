const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const app = require('../app.js');
const  seed  = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

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
        test('Responds with an article object which has the properties \n        - author\n        - title\n        - article_id\n        - body\n        - topic\n        - created_at\n        - votes\n        - comment_count.', () => {
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
        test('Responds with an array of article objects. Each article object should have the properties:\n        - author\n        - title\n        - article_id\n        - topic\n        - created_at\n        - votes\n        - comment_count', () => {
            return request(app)
              .get('/api/articles/')
              .expect(200)
              .then((response) => { 
                  const articles = response.body.articles;
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

