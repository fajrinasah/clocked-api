import { ValidationError } from "yup";
import chalk from "chalk";

import { Shift } from "../../database/models/shift.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatuses.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessages.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// ADD SHIFT
/*----------------------------------------------------*/
export const addShift = async (req, res, next) => {
  try {
    // VALIDATE DATA
    const { name, fromTime, toTime } = req.body;
    await validation.addShiftValidationSchema.validate(req.body);

    // CHECK IF SHIFT'S NAME ALREADY EXISTS
    const shiftExists = await Shift?.findOne({
      where: { name },
    });

    if (shiftExists)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST + ": shift's name was already registered.",
      };

    // INSERT NEW SHIFT'S DATA TO DB
    await Shift?.create({
      name,
      from_time: fromTime,
      to_time: toTime,
    });

    // GET NEWLY ADDED SHIFT DATA WITH CAMEL-CASED PROP NAME
    const shift = await Shift?.findOne({
      where: { name },

      attributes: [
        "id",
        "name",
        ["from_time", "fromTime"],
        ["to_time", "toTime"],
      ],
    });

    // SEND RESPONSE
    res.status(201).json({
      message: "Shift was created successfully.",
      shift,
    });
  } catch (error) {
    // IF ERROR FROM VALIDATION
    if (error instanceof ValidationError) {
      console.error(chalk.bgRedBright("Validation Error: "));

      return next({
        status: errorStatus.BAD_REQUEST_STATUS,
        message: error?.errors?.[0],
      });
    }

    next(error);
  }
};
