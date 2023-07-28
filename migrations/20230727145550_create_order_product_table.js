exports.up = function (knex) {
  return knex.schema.createTable("ORDER_PRODUCT", (table) => {
    table.integer("orderId").unsigned();
    table.integer("productId").unsigned();

    table
      .foreign("orderId")
      .references("id")
      .inTable("ORDER_DETAILS")
      .onDelete("CASCADE");

    table
      .foreign("productId")
      .references("id")
      .inTable("PRODUCT")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("ORDER_PRODUCT");
};
