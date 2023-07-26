exports.up = function (knex) {
  return knex.schema.alterTable("PRODUCT", (table) => {
    table.integer("ownerId").unsigned().notNullable();
    table
      .foreign("ownerId")
      .references("id")
      .inTable("USER")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.table("PRODUCT", (table) => {
    table.dropColumn("ownerId");
  });
};
