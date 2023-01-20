/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('token', (tbl) => {
    tbl.text('id', 32).primary;
    tbl.text('token').notNullable();
    tbl.timestamp('created_at').notNullable();
    // Foreign Key info to 'Lessons' table
    tbl
      .text('userid')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
