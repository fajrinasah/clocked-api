import { ValidationError } from "yup";
import { Op } from "sequelize";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import * as configs from "../../configs/index.js";
import * as helpers from "../../helpers/index.js";
import { User } from "../../database/models/user.js";
import { Salary } from "../../database/models/salary.js";
import { AttendanceLog } from "../../database/models/attendanceLog.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatuses.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessages.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// SET SALARY
/*----------------------------------------------------*/
export const setSalary = async (req, res, next) => {
  try {
    // VALIDATE DATA
    const { employee_email, salary_period, base_amount } = req.body;
    await validation.setSalaryValidationSchema.validate(req.body);

    // GET EMPLOYEE'S DATA
    const employee = await User?.findOne({
      where: { email: employee_email },
    });

    // CHECK IF SALARY DATA WITH THE SAME EMPLOYEE AND THE SAME DATE HAS ALREADY EXISTS
    const salaryExists = await Salary?.findOne({
      where: { employee_id: employee?.dataValues?.id, for: salary_period },
    });

    if (salaryExists)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          `: salary data for this employee with payment date ${salary_period} is already exists.`,
      };

    // GET TOTAL DEDUCTION FROM ATTENDANCE LOGS
    const total_deduction = await AttendanceLog?.sum("salary_deduction", {
      where: { scheduled_date: { [Op.startsWith]: salary_period } },
    });

    const total_amount = base_amount - total_deduction;

    // INSERT SALARY DATA TO DB
    const salary = await Salary?.create({
      employee_id: employee?.dataValues?.id,
      for: salary_period,
      base_amount,
      total_deduction,
      total_amount,
    });

    // COMPOSE NOTIFICATION MAIL
    const emailTemplate = fs.readFileSync(
      path.join(process.cwd(), "src", "views", "salaryNotification.html"),
      "utf8"
    );

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    const emailData = handlebars.compile(emailTemplate)({
      name: employee?.dataValues?.full_name,
      salaryFor: salary_period,
      base: formatter.format(base_amount),
      deduction: formatter.format(total_deduction),
      total: formatter.format(total_amount),
    });

    // SEND MAIL
    const mailOptions = {
      from: configs.GMAIL,
      to: employee_email,
      subject: "[Notification] Salary Details",
      html: emailData,
    };

    helpers.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log("Email was sent successfully: " + info.response);
    });

    // DELETE SENSITIVE DATA
    delete salary?.dataValues?.employee_id;

    // SEND RESPONSE
    res.status(201).json({
      message: `Salary was recorded successfully. Notification mail was sent to ${employee_email}`,
      salary,
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
