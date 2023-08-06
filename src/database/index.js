import Sequelize from "sequelize";
// const Sequelize = require("sequelize").Sequelize;
import config from "../configs/index.js";

// SEQUELIZE CONNECTION
const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
