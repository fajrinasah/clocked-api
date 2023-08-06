import jwt from "jsonwebtoken";
import * as configs from "../configs/index.js";

// CREATE TOKEN
export const createToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, configs.JWT_SECRET_KEY, { expiresIn: expiresIn });
};

// VERIFY TOKEN
export const verifyToken = (token) => {
  return jwt.verify(token, configs.JWT_SECRET_KEY);
};
