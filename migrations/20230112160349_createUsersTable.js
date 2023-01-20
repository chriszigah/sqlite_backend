/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', (tbl) => {
    tbl.text('id').index().primary;
    tbl.text('fname', 25).notNullable();
    tbl.text('lname', 25).notNullable();
    tbl.text('email', 50).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
