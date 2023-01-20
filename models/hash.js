const knex = require('knex');
const config = require('../knexfile');
const db = knex(config.development);

module.exports = {
  addHash,
  findAllHashes,
  findHashByID,
  removeHashByID,
  updateHashByID,
};

async function addHash(hash) {
  return await db('hash').insert(hash);
}

async function findAllHashes() {
  return await db('hash');
}

async function findHashByID(id) {
  return await db('hash').where({ id }).first();
}

async function removeHashByID(id) {
  return await db('hash').where({ id }).del();
}

async function updateHashByID(id, changes) {
  return await db('hash')
    .where({ id })
    .update(changes)
    .then(() => {
      return findHashByID(id);
    });
}
