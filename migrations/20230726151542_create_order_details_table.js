exports.up = function (knex) {
  return knex.schema.createTable("ORDER_DETAILS", (table) => {
    table.increments("id").primary();
    table.integer("customerId").unsigned();
    table.float("totalPrice").notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now());

    table
      .foreign("customerId")
      .references("id")
      .inTable("USER")
      .onDelete("SET NULL");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("ORDER_DETAILS");
};
