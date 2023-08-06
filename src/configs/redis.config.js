import redis from "redis";
import chalk from "chalk";
import * as emoji from "node-emoji";

// CONNECT TO REDIS
const client = redis.createClient();
client.on("error", (err) =>
  console.log(chalk.bgRedBright("Redis Client Error: ") + err)
);

client.on("ready", () => {
  console.log(
    chalk.bgGreenBright.bold("Connection with Redis") +
      " has been established successfully." +
      emoji.get("white_check_mark")
  );
});

export default client;
