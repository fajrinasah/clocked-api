import nodemailer from "nodemailer";
import * as configs from "../configs/index.js";

// NODEMAILER TRANSPORTER
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: configs.GMAIL,
    pass: configs.GMAIL_APP_KEY,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
