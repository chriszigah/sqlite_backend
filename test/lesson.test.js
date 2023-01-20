const request = require('supertest');
const app = require('../server');
const knex = require('knex');
const config = require('../knexfile');
const db = knex(config.development);

let testingID = '';

/*  Create a Testing Task */

describe('Create a lesson', () => {
  test('It Should Create a new Lesson', async () => {
    const res = await request(app).post('/lessons').send({
      name: 'English',
    });
    testingID = JSON.parse(res.text).id;
    expect(res.statusCode).toBe(201);
  });
});

describe('Get a Lesson by ID', () => {
  test('It Should GET a lesson by ID', async () => {
    const res = await request(app).get(`/lessons/${testingID}`);
    expect(res.statusCode).toBe(200);
  });
});
describe('Get all Lesson by ID', () => {
  test('It Should GET all lesson ', async () => {
    const res = await request(app).get(`/lessons`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Update a lesson', () => {
  test('It Should Update a existing Lesson', async () => {
    const res = await request(app).patch(`/lessons/${testingID}`).send({
      name: 'Coding',
    });
    expect(res.statusCode).toBe(200);
  });
});

describe('Delete a Lesson by ID', () => {
  test('It Should DELETE all lesson ', async () => {
    const res = await request(app).delete(`/lessons/${testingID}`);
    expect(res.statusCode).toBe(400);
  });
});
