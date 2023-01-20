const knex = require('knex');
const config = require('../knexfile');
const db = knex(config.development);

module.exports = {
  add,
  find,
  findById,
  remove,
  update,
  addMessage,
  findMessageById,
  findAllMessages,
};

async function add(lesson) {
  const [id] = await db('lessons').insert(lesson, 'id');
  return id;
}

async function find() {
  return await db('lessons');
}

async function findById(id) {
  return await db('lessons').where({ id }).first();
}

async function remove(id) {
  return await db('lessons').where({ id }).del();
}

async function update(id, changes) {
  return await db('lessons')
    .where({ id })
    .update(changes)
    .then(() => {
      return findById(id);
    });
}

async function findMessageById(id) {
  return await db('messages').where({ id }).first();
}

async function addMessage(message, lesson_id) {
  const [id] = await db('messages').where({ lesson_id }).insert(message);
  return findMessageById(id);
}

async function findAllMessages() {
  return await db('messages');
}
