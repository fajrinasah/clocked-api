import chalk from "chalk";
import * as emoji from "node-emoji";

import db from "../../database/index.js";

// USING SEQUELIZE
export const sequelizeConnector = async function testConnection() {
  try {
    await db.sequelize.authenticate();
    console.log(
      chalk.bgGreenBright.bold("Connection with database using sequelize") +
        " has been established successfully." +
        emoji.get("white_check_mark")
    );
  } catch (error) {
    console.error("Unable to connect to the database with sequelize:", error);
  }
};
