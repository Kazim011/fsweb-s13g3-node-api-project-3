const knex = require("knex");
const configs = require("../knexfile.js");
const development = process.env.NODE_ENV || "development";

module.exports = knex(configs[development]);
