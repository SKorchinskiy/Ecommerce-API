exports.up = function (knex) {
  return knex.schema.createTable("REVIEW", (table) => {
    table.increments("id").primary();

    table.integer("customerId").unsigned();

    table.integer("rating").notNullable();
    table.string("description", 200).notNullable();
    table.string("advantages", 200).notNullable();
    table.string("disadvantages", 200).notNullable();

    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table
      .foreign("customerId")
      .references("id")
      .inTable("USER")
      .onDelete("NO ACTION");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("REVIEW");
};
