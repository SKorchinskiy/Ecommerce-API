exports.up = function (knex) {
  return knex.schema.alterTable("ORDER_PRODUCT", (table) => {
    table.primary(["orderId", "productId"]);
    table.integer("quantity").notNullable();
    table.integer("price").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("ORDER_PRODUCT", (table) => {
    table.dropColumn("quantity");
    table.dropColumn("price");
  });
};
