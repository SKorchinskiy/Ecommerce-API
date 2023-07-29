exports.up = function (knex) {
  return knex.schema.alterTable("USER", (table) => {
    table
      .string("avatar_path")
      .defaultTo(
        "/Users/oleksandr/Documents/ztm-projects/ecommerce-api/static/avatar/avatar-default.png"
      )
      .alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("USER", (table) => {
    table.string("avatar_path").defaultTo(null).alter();
  });
};
