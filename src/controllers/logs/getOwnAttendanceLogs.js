import { ValidationError } from "yup";
import { Op } from "sequelize";
import chalk from "chalk";

import { User } from "../../database/models/user.js";
import { AttendanceLog, Shift } from "../../database/models/associations.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatuses.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessages.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// GET ONE'S OWN ATTENDANCE LOGS
/*----------------------------------------------------*/
export const getOwnAttendanceLogs = async (req, res, next) => {
  try {
    const { uuid } = req.user;
    const { period, sortingOption, sortingMethod, page } = req.query;

    // VALIDATE REQ.QUERY
    await validation.employeeAttendanceLogsQuery.validate(req.query);

    // GET EMPLOYEE'S DATA
    const employee = await User?.findOne({
      where: { uuid },
    });

    /*------------------------------------------------------*/
    // PAGINATION OPTIONS
    /*------------------------------------------------------*/
    const options = {
      offset: page > 1 ? parseInt(page - 1) * 10 : 0,
      limit: page ? 10 : null,
    };

    /*------------------------------------------------------*/
    // WHERE CONDITION(S)
    /*------------------------------------------------------*/
    const whereCondition = {
      employee_id: employee?.dataValues?.id,
      scheduled_date: { [Op.startsWith]: period },
    };

    /*------------------------------------------------------*/
    // SORT OPTION
    /*------------------------------------------------------*/
    let sortingConfig = [];

    if (sortingOption === "date") {
      sortingConfig = [["id", sortingMethod === "ASC" ? "ASC" : "DESC"]];
    } else {
      sortingConfig = [
        ["salary_deduction", sortingMethod === "ASC" ? "ASC" : "DESC"],
      ];
    }

    /*------------------------------------------------------*/
    // GET DATA FROM DB
    /*------------------------------------------------------*/
    const logs = await AttendanceLog.findAll({
      where: whereCondition,

      attributes: [
        "id",
        ["scheduled_date", "scheduledDate"],
        ["clocked_in", "clockedIn"],
        ["clocked_out", "clockedOut"],
        ["salary_deduction", "salaryDeduction"],
      ],

      include: [
        {
          model: Shift,
          attributes: [
            "id",
            "name",
            ["from_time", "fromTime"],
            ["to_time", "toTime"],
          ],
          required: true,
        },
      ],

      order: sortingConfig,

      // PAGINATION OPTIONS
      ...options,
    });

    const totalLogs = await AttendanceLog?.count({ where: whereCondition });

    const totalPages = page ? Math.ceil(totalLogs / options.limit) : null;

    // CHECK IF THERE'S NO DATA
    if (!logs.length)
      throw {
        status: errorStatus.NOT_FOUND_STATUS,
        message: errorMessage.DATA_NOT_FOUND + ": no log's data yet",
      };

    // SEND RESPONSE
    res.status(200).json({
      page: parseInt(page),
      totalPages,
      totalLogs,
      logsLimit: options.limit,
      logs,
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
