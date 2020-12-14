const Knex = require("knex");
const config = require("../knexfile.js");
const db = Knex(config.development);

module.exports = db;
