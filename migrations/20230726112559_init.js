exports.up = function (knex) {
  return knex.schema
    .createTable("USER", (table) => {
      table.increments("id").primary();
      table.string("username", 20).notNullable().unique();
      table.string("email", 50).notNullable().unique();
      table.text("password").notNullable();
    })
    .createTable("ROLE", (table) => {
      table.increments("id").primary();
      table.integer("userId").unsigned().notNullable();
      table.string("role", 20).notNullable();

      table
        .foreign("userId")
        .references("id")
        .inTable("USER")
        .onDelete("CASCADE");
    })
    .createTable("PRODUCT", (table) => {
      table.increments("id").primary();
      table.string("productName", 50).notNullable();
      table.integer("price").notNullable();
      table.integer("quantity").defaultTo("0");
      table.datetime("createdAt").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("PRODUCT").dropTable("ROLE").dropTable("USER");
};
