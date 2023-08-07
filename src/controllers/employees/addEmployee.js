import { ValidationError } from "yup";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";
import chalk from "chalk";

import * as configs from "../../configs/index.js";
import * as helpers from "../../helpers/index.js";
import { User } from "../../database/models/user.js";
import { Position } from "../../database/models/position.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatuses.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessages.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// ADD EMPLOYEE
/*----------------------------------------------------*/
export const addEmployee = async (req, res, next) => {
  try {
    // VALIDATE DATA
    const { email, position_id } = req.body;
    await validation.addEmployeeValidationSchema.validate(req.body);

    // CHECK IF USER ALREADY EXISTS
    const userExists = await User?.findOne({
      where: { email },
    });

    if (userExists)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_ALREADY_EXISTS,
      };

    // CHECK IF POSITION ID EXISTS
    const positionIdExists = await Position?.findOne({
      where: { id: position_id },
    });

    if (!positionIdExists)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.BAD_REQUEST + ": position ID not found",
      };

    // GENERATE OTP TOKEN FOR VERIFICATION PROCESS
    const otpToken = helpers.generateOtp();

    // INSERT USER'S DATA TO USERS TABLE
    const user = await User?.create({
      email,
      position_id,
      otp: otpToken,
      otp_exp: DateTime.now().plus({ days: 1 }).toFormat("yyyy-LL-dd hh:mm:ss"),
    });

    // COMPOSE "ACCOUNT VERIFICATION" MAIL
    const emailTemplate = fs.readFileSync(
      path.join(process.cwd(), "src", "views", "accountVerification.html"),
      "utf8"
    );

    const emailData = handlebars.compile(emailTemplate)({
      email,
      otpToken,
      link: configs.REDIRECT_URL + `/auth/verify/act-${user?.dataValues?.uuid}`,
    });

    // SEND MAIL
    const mailOptions = {
      from: configs.GMAIL,
      to: email,
      subject: "Account Verification for Attendance App",
      html: emailData,
    };

    helpers.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log("Email was sent successfully: " + info.response);
    });

    // DELETE SENSITIVE DATA FROM USER'S DATA THAT WILL BE SENT TO CLIENT
    delete user?.dataValues?.id;
    delete user?.dataValues?.uuid;
    delete user?.dataValues?.password;
    delete user?.dataValues?.otp;
    delete user?.dataValues?.otp_exp;

    // SEND RESPONSE
    res.status(201).json({
      message: `Account was created successfully. Account verification mail was sent to ${email}`,
      user,
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
