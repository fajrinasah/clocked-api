import client from "../../configs/redis.config.js";

export const redisConnector = () => {
  client.connect();
};
