import { ValidationError } from "yup";
import { DateTime } from "luxon";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import * as configs from "../../configs/index.js";
import * as helpers from "../../helpers/index.js";
import { User } from "../../database/models/user.js";
import { Shift } from "../../database/models/shift.js";
import { AttendanceLog } from "../../database/models/attendanceLog.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatuses.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessages.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// SET SHIFT
/*----------------------------------------------------*/
export const setShift = async (req, res, next) => {
  try {
    // VALIDATE DATA
    const { employeeEmail, scheduledDate, shiftId, salaryDeduction } = req.body;
    await validation.setShiftValidationSchema.validate(req.body);

    // GET EMPLOYEE'S DATA
    const employee = await User?.findOne({
      where: { email: employeeEmail },
    });

    // GET SHIFT'S DATA
    const shift = await Shift?.findOne({
      where: { id: shiftId },
    });

    // CHECK IF SCHEDULE WITH THE SAME EMPLOYEE AT THE SAME DATE HAS ALREADY EXISTS
    const scheduleExists = await AttendanceLog?.findOne({
      where: {
        employee_id: employee?.dataValues?.id,
        scheduled_date: scheduledDate,
      },
    });

    if (scheduleExists)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          `: schedule for ${scheduledDate} was already assigned to ${employee?.dataValues?.full_name} `,
      };

    // INSERT SCHEDULED SHIFT TO ATTENDANCE LOG
    await AttendanceLog?.create({
      employee_id: employee?.dataValues?.id,
      scheduled_date: scheduledDate,
      shift_id: shiftId,
      salary_deduction: salaryDeduction,
    });

    // COMPOSE NOTIFICATION MAIL
    const emailTemplate = fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "views",
        "scheduledShiftNotification.html"
      ),
      "utf8"
    );

    const formattedStart = DateTime.fromSQL(
      shift?.dataValues?.from_time
    ).toLocaleString(DateTime.TIME_24_SIMPLE);

    const formattedEnd = DateTime.fromSQL(
      shift?.dataValues?.to_time
    ).toLocaleString(DateTime.TIME_24_SIMPLE);

    const emailData = handlebars.compile(emailTemplate)({
      name: employee?.dataValues?.full_name,
      shift: shift?.dataValues?.name,
      date: scheduledDate,
      start: formattedStart,
      end: formattedEnd,
    });

    // SEND MAIL
    const mailOptions = {
      from: configs.GMAIL,
      to: employeeEmail,
      subject: "[Notification] New Scheduled Shift",
      html: emailData,
    };

    helpers.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log("Email was sent successfully: " + info.response);
    });

    // GET NEWLY ADDED SHIFT DATA WITH CAMEL-CASED PROP NAME
    const log = await AttendanceLog?.findOne({
      where: {
        employee_id: employee?.dataValues?.id,
        scheduled_date: scheduledDate,
      },

      attributes: [
        "id",
        ["scheduled_date", "scheduledDate"],
        ["clocked_in", "clockedIn"],
        ["clocked_out", "clockedOut"],
        ["salary_deduction", "salaryDeduction"],
      ],
    });

    // SEND RESPONSE
    res.status(201).json({
      message: `New scheduled shift has been registered successfully. Notification mail was sent to ${employeeEmail}`,
      log,
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
