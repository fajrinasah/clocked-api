import { DateTime } from "luxon";

import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatuses.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessages.js";
import { User } from "../../database/models/user.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// VERIFY OTP TOKEN
/*----------------------------------------------------*/
export const verifyOtp = async (req, res, next) => {
  try {
    const { uuidWithContext } = req.params;
    const { token } = req.body;
    await validation.tokenValidationSchema.validate(req.body);

    // GET UUID
    const cleanedUuid = uuidWithContext.split("-")?.slice(1)?.join("-");

    // CHECK IF USER EXISTS
    const user = await User?.findOne({ where: { uuid: cleanedUuid } });
    if (!user)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_DOES_NOT_EXISTS,
      };

    // VERIFY OTP TOKEN
    if (token !== user?.dataValues?.otp)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.INVALID_CREDENTIALS + `: wrong OTP token.`,
      };

    // CHECK TOKEN'S EXPIRE DATE/TIME
    const isExpired =
      DateTime.now().toFormat("yyyy-LL-dd hh:mm:ss") >
      user?.dataValues?.otp_exp;

    if (isExpired)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.INVALID_CREDENTIALS + `: OTP token has expired.`,
      };

    // RESET OTP & ITS EXPIRED DATETIME
    await User?.update(
      { otp: null, otp_exp: null },
      { where: { uuid: cleanedUuid } }
    );

    // SEND RESPONSE
    res.status(200).json({
      message: "OTP token was successfully verified.",
    });
  } catch (error) {
    next(error);
  }
};
