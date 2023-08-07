import { ValidationError } from "yup";
import chalk from "chalk";

import { User } from "../../database/models/user.js";
import { AttendanceLog } from "../../database/models/attendanceLog.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatuses.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessages.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// CLOCKED IN/OUT
/*----------------------------------------------------*/
export const clockedInOut = async (req, res, next) => {
  try {
    const { uuid } = req.user;

    // VALIDATE DATA
    const { scheduled_date, type, time } = req.body;
    await validation.clockedInOutValidationSchema.validate(req.body);

    // GET EMPLOYEE'S DATA
    const employee = await User?.findOne({
      where: { uuid },
    });

    // GET ATTENDANCE LOG DATA BASED ON EMPLOYEE'S ID AND SCHEDULED DATE
    const schedule = await AttendanceLog.findOne({
      where: {
        employee_id: employee?.dataValues?.id,
        scheduled_date,
      },
    });

    // IF NO SCHEDULE WAS FOUND
    if (!schedule)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          `: no schedule was assigned to ${employee?.dataValues?.full_name} for ${scheduled_date}`,
      };

    // IF CLOCKED IN/OUT COLUMN WAS ALREADY FILLED
    if (type === "in" && schedule.dataValues.clocked_in)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          `: already clocked in for ${scheduled_date}`,
      };

    if (type === "out" && schedule.dataValues.clocked_out)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          `: already clocked out for ${scheduled_date}`,
      };

    // CUT INITIAL SALARY DEDUCTION BASED ON TYPE
    const currentSalaryDeduction = schedule?.dataValues?.salary_deduction;
    const updatedSalaryDeduction =
      type === "in" ? currentSalaryDeduction / 2 : null;

    // INSERT CLOCKED IN/OUT TIME TO ATTENDANCE LOG
    const columnsToUpdate =
      type === "in"
        ? { clocked_in: time, salary_deduction: updatedSalaryDeduction }
        : { clocked_out: time, salary_deduction: updatedSalaryDeduction };

    await AttendanceLog.update(columnsToUpdate, {
      where: {
        employee_id: employee?.dataValues?.id,
        scheduled_date,
      },
    });

    // SEND RESPONSE
    res.status(200).json({
      message:
        type === "in"
          ? "Clocked in successfully."
          : "Clocked out successfully.",
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
