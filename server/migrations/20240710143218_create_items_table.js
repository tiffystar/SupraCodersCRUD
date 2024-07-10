/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('items', table => {
        table.increments();
        table.string('item_name', 12);
        table.string('description', 500);
        table.integer('quantity');
        table.integer('users_id');
        table.foreign('users_id').references('users.id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('items', table => {
        table.dropForeign('users_id')
      })
      .then(function(){
        return knex.schema.dropTableIfExists('items');
      });
};
