const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const app = require('../app.js');
const  seed  = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

/*
#### **GET /api/topics**

Responds with:

- an array of topic objects, each of which should have the following properties:
  - `slug`
  - `description`*/

/*{ 'topics': [
    { 'slug' : 'coding',
      'description': ' code is love, code is life'}, 
    { 'slug' : 'football', 
      'description': 'FOOTIE!'}, 
   ]
} */

console.log(app, '<<<this is the app')

describe('/api/topics', () => {
    describe('GET', () => {
        test('Responds with status: 200 and an array of topic objects. Each object should have \'slug\' and \'description\' properties.', () => {
            //console.log(testData, '<<< test data');
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

