import chalk from "chalk";

export function requestLogger(req, res, next) {
  console.log(chalk.bgYellowBright(`[${req.method}]`) + ` ${req.url}`);
  next();
}
