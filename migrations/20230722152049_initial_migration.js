exports.up = function (knex) {
  return knex.schema.createTable("testM", function (table) {
    table.increments("id", { primaryKey: true });
    table.boolean("works").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("testM");
};
