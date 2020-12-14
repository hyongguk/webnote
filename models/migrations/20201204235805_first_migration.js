exports.up = function(knex) {
  return knex.schema
    .createTable("users", function(table) {
      table.increments("user_id").primary();
      table.string("email_adress", 255).notNullable();
      table.string("password", 255).notNullable();
    })
    .createTable("notes", function(table) {
      table.increments("id");
      table.string("title", 1000).notNullable;
      table.text("body");
      table.timestamp("update_at").notNullable();
      table.integer("user_id");
      table
        .foreign("user_id")
        .references("user_id")
        .inTable("users");
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users").dropTable("notes");
};
