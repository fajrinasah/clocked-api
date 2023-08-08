import { ValidationError } from "yup";
import { Op } from "sequelize";
import chalk from "chalk";

import { User } from "../../database/models/user.js";
import { Salary } from "../../database/models/salary.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatuses.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessages.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// GET ONE'S OWN PAYROLL REPORTS
/*----------------------------------------------------*/
export const getOwnPayrollReports = async (req, res, next) => {
  try {
    const { uuid } = req.user;
    const { filter, period, sortingOption, sortingMethod, page } = req.query;

    // VALIDATE REQ.QUERY
    await validation.reportsQueryValidationSchema.validate(req.query);

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
      for: filter === "month" ? period : { [Op.startsWith]: period },
    };

    /*------------------------------------------------------*/
    // SORT OPTION
    /*------------------------------------------------------*/
    let sortingConfig = [];

    if (sortingOption === "date") {
      sortingConfig = [["id", sortingMethod === "ASC" ? "ASC" : "DESC"]];
    } else {
      sortingConfig = [
        ["total_amount", sortingMethod === "ASC" ? "ASC" : "DESC"],
      ];
    }

    /*------------------------------------------------------*/
    // GET DATA FROM DB
    /*------------------------------------------------------*/
    const reports = await Salary.findAll({
      attributes: [
        "id",
        "for",
        ["base_amount", "baseAmount"],
        ["total_deduction", "totalDeduction"],
        ["total_amount", "totalAmount"],
        ["created_at", "createdAt"],
      ],

      where: whereCondition,

      order: sortingConfig,

      // PAGINATION OPTIONS
      ...options,
    });

    const totalReports = await Salary?.count({ where: whereCondition });

    const totalPages = page ? Math.ceil(totalReports / options.limit) : null;

    // CHECK IF THERE'S NO DATA
    if (!reports.length)
      throw {
        status: errorStatus.NOT_FOUND_STATUS,
        message: errorMessage.DATA_NOT_FOUND + ": no report's data yet",
      };

    // SEND RESPONSE
    res.status(200).json({
      page: parseInt(page),
      totalPages,
      totalReports,
      reportsLimit: options.limit,
      reports,
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
