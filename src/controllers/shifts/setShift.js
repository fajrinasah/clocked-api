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
    const { employee_email, scheduled_date, shift_id, salary_deduction } =
      req.body;
    await validation.setShiftValidationSchema.validate(req.body);

    // GET EMPLOYEE'S DATA
    const employee = await User?.findOne({
      where: { email: employee_email },
    });

    // GET SHIFT'S DATA
    const shift = await Shift?.findOne({
      where: { id: shift_id },
    });

    // CHECK IF SCHEDULE WITH THE SAME EMPLOYEE AT THE SAME DATE HAS ALREADY EXISTS
    const scheduleExists = await AttendanceLog?.findOne({
      where: { employee_id: employee?.dataValues?.id, scheduled_date },
    });

    if (scheduleExists)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          `: schedule for ${scheduled_date} was already assigned to ${employee?.dataValues?.full_name} `,
      };

    // INSERT SCHEDULED SHIFT TO ATTENDANCE LOG
    const attendanceLog = await AttendanceLog?.create({
      employee_id: employee?.dataValues?.id,
      scheduled_date,
      shift_id,
      salary_deduction,
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
      date: scheduled_date,
      start: formattedStart,
      end: formattedEnd,
    });

    // SEND MAIL
    const mailOptions = {
      from: configs.GMAIL,
      to: employee_email,
      subject: "[Notification] New Scheduled Shift",
      html: emailData,
    };

    helpers.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log("Email was sent successfully: " + info.response);
    });

    // DELETE SENSITIVE DATA
    delete attendanceLog?.dataValues?.employee_id;

    // SEND RESPONSE
    res.status(201).json({
      message: `New scheduled shift has been registered successfully. Notification mail was sent to ${employee_email}`,
      attendanceLog,
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
