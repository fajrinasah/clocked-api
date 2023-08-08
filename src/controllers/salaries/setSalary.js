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
    const { employeeEmail, salaryPeriod, baseAmount } = req.body;
    await validation.setSalaryValidationSchema.validate(req.body);

    // GET EMPLOYEE'S DATA
    const employee = await User?.findOne({
      where: { email: employeeEmail },
    });

    // CHECK IF SALARY DATA WITH THE SAME EMPLOYEE AND THE SAME DATE HAS ALREADY EXISTS
    const salaryExists = await Salary?.findOne({
      where: { employee_id: employee?.dataValues?.id, for: salaryPeriod },
    });

    if (salaryExists)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          `: salary data for this employee with payment date ${salaryPeriod} is already exists.`,
      };

    // GET TOTAL DEDUCTION FROM ATTENDANCE LOGS
    const totalDeduction = await AttendanceLog?.sum("salary_deduction", {
      where: { scheduled_date: { [Op.startsWith]: salaryPeriod } },
    });

    const totalAmount = totalDeduction
      ? baseAmount - totalDeduction
      : baseAmount;

    // INSERT SALARY DATA TO DB
    await Salary?.create({
      employee_id: employee?.dataValues?.id,
      for: salaryPeriod,
      base_amount: baseAmount,
      total_deduction: totalDeduction,
      total_amount: totalAmount,
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
      salaryFor: salaryPeriod,
      base: formatter.format(baseAmount),
      deduction: formatter.format(totalDeduction),
      total: formatter.format(totalAmount),
    });

    // SEND MAIL
    const mailOptions = {
      from: configs.GMAIL,
      to: employeeEmail,
      subject: "[Notification] Salary Details",
      html: emailData,
    };

    helpers.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log("Email was sent successfully: " + info.response);
    });

    // GET NEWLY ADDED SALARY DATA WITH CAMEL-CASED PROP NAME
    const salary = await Salary?.findOne({
      where: { employee_id: employee?.dataValues?.id, for: salaryPeriod },

      attributes: [
        "id",
        "for",
        ["base_amount", "baseAmount"],
        ["total_deduction", "totalDeduction"],
        ["total_amount", "totalAmount"],
        ["created_at", "createdAt"],
      ],
    });

    // SEND RESPONSE
    res.status(201).json({
      message: `Salary was recorded successfully. Notification mail was sent to ${employeeEmail}`,
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
