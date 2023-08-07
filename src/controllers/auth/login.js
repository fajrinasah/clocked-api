import { ValidationError } from "yup";

import client from "../../configs/redis.config.js";
import * as helpers from "../../helpers/index.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatuses.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessages.js";
import { User } from "../../database/models/user.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// LOGIN
/*----------------------------------------------------*/
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await validation.loginValidationSchema.validate(req.body);

    // CHECK IF USER EXISTS
    const user = await User?.findOne({
      where: { email },
    });

    if (!user)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_DOES_NOT_EXISTS,
      };

    // CHECK IF USER IS AN EMPLOYEE AND HAVE NOT ACTIVATED THEIR ACCOUNT YET
    if (user.dataValues?.role_id === 2 && !user.dataValues.full_name) {
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_DOES_NOT_EXISTS,
      };
    }

    // CHECK IF PASSWORD CORRECT
    const decrypted = helpers.encryptions.decrypt(password);

    const isPasswordCorrect = helpers.encryptions.compare(
      decrypted,
      user.dataValues?.password
    );

    if (!isPasswordCorrect) {
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.INVALID_CREDENTIALS + `: wrong password.`,
      };
    }

    // CHECK TOKEN IN REDIS
    const cachedToken = await client.get(user?.dataValues?.uuid);
    const tokenIsValid = cachedToken && helpers.verifyToken(cachedToken);

    let accessToken = null;

    if (tokenIsValid) {
      accessToken = cachedToken;
    } else {
      // GENERATE NEW ACCESS TOKEN
      accessToken = helpers.createToken({
        uuid: user?.dataValues?.uuid,
        role_id: user?.dataValues?.role_id,
      });

      // SET ACCESS TOKEN
      await client.set(user?.dataValues?.uuid, accessToken, {
        EX: 86400, // 1d
      });
    }

    // DELETE SENSITIVE DATA FROM USER'S DATA THAT WILL BE SENT TO CLIENT
    delete user?.dataValues?.id;
    delete user?.dataValues?.uuid;
    delete user?.dataValues?.password;
    delete user?.dataValues?.otp;
    delete user?.dataValues?.otp_exp;

    // SEND RESPONSE
    res
      .header("Authorization", `Bearer ${accessToken}`)
      .status(200)
      .json({ user });
  } catch (error) {
    // CHECK IF THE ERROR COMES FROM VALIDATION
    if (error instanceof ValidationError) {
      return next({
        status: errorStatus.BAD_REQUEST_STATUS,
        message: error?.errors?.[0],
      });
    }

    // PASS TO GLOBAL ERROR HANDLER
    next(error);
  }
};
