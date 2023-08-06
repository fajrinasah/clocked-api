import * as errorMessage from "./errorMessages.js";
import * as errorStatus from "./errorStatuses.js";

export function errorHandler(error, req, res, next) {
  console.log(error.message || error);

  // IF ERROR FROM SEQUELIZE
  if (error?.name === "SequelizeValidationError") {
    return res
      .status(errorStatus.BAD_REQUEST_STATUS)
      .json({ message: error?.errors?.[0]?.message });
  }

  const message = error?.message || errorMessage.SOMETHING_WENT_WRONG;
  const status = error?.status || errorStatus.DEFAULT_ERROR_STATUS;
  const data = error?.data || null;
  res.status(status).json({ type: "error", status, message, data });
}
