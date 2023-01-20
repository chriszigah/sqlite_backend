/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('lessons', (tbl) => {
      tbl.text('id', 32).primary;
      tbl.text('name', 128).notNullable;
      tbl.timestamps(true, true);
    })
    .createTable('messages', (tbl) => {
      tbl.increments();
      tbl.string('sender').notNullable().index();
      tbl.text('text').notNullable();
      tbl.timestamps(true, true);

      // Foreign Key info to 'Lessons' table
      tbl
        .integer('lesson_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('lessons')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('messages').dropTableIfExists('lessons');
};
