exports.up = function (knex) {
  return knex.schema.alterTable("USER", (table) => {
    table.string("avatar_path");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("USER", (table) => {
    table.dropColumn("avatar_path");
  });
};
