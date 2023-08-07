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
    const { name, from_time, to_time } = req.body;
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
    const shift = await Shift?.create({
      name,
      from_time,
      to_time,
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